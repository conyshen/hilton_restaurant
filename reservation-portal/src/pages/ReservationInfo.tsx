import { ChangeEvent, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { getParsedDate } from "../utils/utils";
import { addMonths, format, setHours, setMinutes } from "date-fns";
import { config } from "../config";
import DatePicker from "react-datepicker";
import {
  ReservationInfoInputProps,
  inputValueUpdateProps,
  InputError,
} from "../types/types";
import {
  LIST_ALL_BOOKINGS,
  UPDATE_BOOKING,
  LIST_BOOKINGS_BY_STATUS_DATE,
} from "../api/graphql/queries";
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
const ReservationInfo = () => {
  const [checkReservationVisible, setCheckReservationVisible] = useState(false);

  const [startUpdateVisible, setStartUpdateVisible] = useState(false);
  const [updateBookingAPI] = useMutation(UPDATE_BOOKING);
  const [inputFilter, setInputFilter] = useState({
    arrivalDate: "",
    status: "",
  });
  const [bookingUpdate, setBookingUpdate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(getParsedDate);
  const [filteredDate, setFilteredDate] = useState<Date | null>();
  const [errors, setErrors] = useState<InputError>({
    tableSizeError: "",
    contactError: "",
  });
  const onChangeFilteredTime = (e: any) => {
    setFilteredDate(e);
  };
  const startUpdate = (bookingId: string) => {
    setBookingUpdate(bookingId);
    setStartUpdateVisible(true);
  };
  const [inputValueUpdate, setInputValueUpdate] =
    useState<inputValueUpdateProps>({
      tableSize: 1,
      arrivalDate: format(new Date(), "dd-MM-yyyy"),
      arrivalTime: format(new Date(), "hh:mm"),
      status: "confirmed",
    });
  const filterPassedTime = (time: Date) => {
    if (!selectedDate) return true;
    const now = new Date();
    const isSameDay = selectedDate.toDateString() === now.toDateString();
    if (isSameDay) {
      return time.getTime() > now.getTime();
    }
    return true;
  };

  const handleTableSize = (e: any) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numberValue = parseInt(value, 10);
      if (numberValue >= 1 && numberValue <= 15) {
        setInputValueUpdate((prev) => ({ ...prev, tableSize: numberValue }));
        setErrors((prev) => ({ ...prev, tableSizeError: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          tableSizeError: "Table size must be between 1 and 10",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        tableSizeError: "Table size must be a valid number",
      }));
    }
  };

  const handleStatusChange = (e: any) => {
    setInputValueUpdate((prev) => ({ ...prev, status: e.target.value }));
  };

  const onChangeArrivalTime = (e: any) => {
    setSelectedDate(e);
  };

  const submitUpdate = async (e: any, id: string) => {
    e.preventDefault();
    try {
      await updateBookingAPI({
        variables: {
          id: id,
          bookingUpdate: {
            arrivalTime: inputValueUpdate.arrivalTime,
            arrivalDate: inputValueUpdate.arrivalDate,
            tableSize: inputValueUpdate.tableSize,
            status: inputValueUpdate.status,
          },
        },
      }).then((res: any) => {
        if (res.data.updateBookingById.id) {
          NotificationManager.success(
            `booking id: ${res.data.updateBookingById.id}`,
            "Update Successfully"
          );
          res.data.updateBookingById.id = "";
          setTimeout(() => {
            setCheckReservationVisible(false);
          }, 1000);
        }
      });
    } catch (e) {
      console.log();
    }
  };
  useEffect(() => {
    console.log("filteredDate>>", filteredDate);
    setInputFilter((prev: any) => ({ ...prev, arrivalDate: filteredDate }));
  }, [filteredDate]);

  const handleStatusFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    setInputFilter((prev: any) => ({ ...prev, status: e.target.value }));
  };

  const [isFiltered, setIsFiltered] = useState(false);
  let { data, loading, error } = useQuery(
    !isFiltered ? LIST_ALL_BOOKINGS : LIST_BOOKINGS_BY_STATUS_DATE,
    {
      variables: {
        arrivalDate: inputFilter.arrivalDate
          ? format(inputFilter.arrivalDate, "dd-MM-yyyy")
          : "",
        status: inputFilter.status,
      },
    }
  );

  const handleFilter = (e: any) => {
    e.preventDefault();
    setIsFiltered(true);
  };
  const handleClear = () => {
    setFilteredDate(null);
  };
  const cancelUpdate = (e: any, id: string) => {
    e.preventDefault();
    setStartUpdateVisible(false);
    id = "";
  };
  return (
    <div className="reservation-info">
      <div className="filter-board">
        <div>
          Date:
          <DatePicker
            onChange={onChangeFilteredTime}
            dateFormat="dd-MM-yyyy"
            selected={filteredDate}
          ></DatePicker>
          <button onClick={handleClear}>Clear</button>
        </div>
        <div>
          Status:
          <select onChange={handleStatusFilter}>
            <option value=""></option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="cancel">cancel</option>
          </select>
        </div>
        <div>
          <button type="button" onClick={handleFilter}>
            Search
          </button>
        </div>
      </div>
      <div className="filter-cards">
        {data &&
          data?.listAllBooking?.map((booking: any) => {
            return (
              <div className="reservation-card" key={booking.id}>
                <p>Guest: {booking.guestName}</p>
                <p>Contact: {booking.contact}</p>
                <p>
                  Table Size:
                  {!startUpdateVisible && booking.tableSize}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <input
                      value={inputValueUpdate.tableSize}
                      id="table-size"
                      required
                      max={config.reservation.tableSizeMax}
                      min={config.reservation.tableSizeMin}
                      onChange={handleTableSize}
                    />
                  )}
                </p>
                <p>
                  Arrival Date:
                  {!startUpdateVisible && booking.arrivalDate}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <DatePicker
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      minDate={new Date()}
                      maxDate={addMonths(new Date(), 1)}
                      minTime={setHours(setMinutes(new Date(), 0), 11)}
                      maxTime={setHours(setMinutes(new Date(), 30), 20)}
                      onChange={onChangeArrivalTime}
                      dateFormat="dd-MM-yyyy HH:mm"
                      filterTime={filterPassedTime}
                      selected={selectedDate}
                    ></DatePicker>
                  )}
                </p>
                <p>
                  {!startUpdateVisible && (
                    <>Arrival Time: {booking.arrivalTime}</>
                  )}
                </p>
                <p>
                  Status:
                  {!startUpdateVisible && booking.status}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <select
                      onChange={handleStatusChange}
                      value={
                        inputValueUpdate.status
                          ? inputValueUpdate.status
                          : booking.status
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancel">cancel</option>
                    </select>
                  )}
                </p>
                {!startUpdateVisible && (
                  <button onClick={() => startUpdate(booking.id)}>
                    Update
                  </button>
                )}
                {startUpdateVisible && bookingUpdate == booking.id && (
                  <button
                    onClick={(e) => submitUpdate(e, booking.id)}
                    disabled={
                      startUpdateVisible && bookingUpdate !== booking.id
                    }
                  >
                    Confirm Update
                  </button>
                )}
                {startUpdateVisible && bookingUpdate == booking.id && (
                  <button
                    onClick={(e) => cancelUpdate(e, booking.id)}
                    disabled={
                      startUpdateVisible && bookingUpdate !== booking.id
                    }
                  >
                    cancel
                  </button>
                )}
              </div>
            );
          })}
      </div>
      <div className="filter-cards">
        {isFiltered &&
          data &&
          data?.listAllbookingByStatusDate?.map((booking: any) => {
            return (
              <div className="reservation-card" key={booking.id}>
                <p>Guest: {booking.guestName}</p>
                <p>Contact: {booking.contact}</p>
                <p>
                  Table Size:
                  {!startUpdateVisible && booking.tableSize}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <input
                      value={inputValueUpdate.tableSize}
                      id="table-size"
                      required
                      max={config.reservation.tableSizeMax}
                      min={config.reservation.tableSizeMin}
                      onChange={handleTableSize}
                    />
                  )}
                </p>
                <p>
                  Arrival Date:
                  {!startUpdateVisible && booking.arrivalDate}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <DatePicker
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      minDate={new Date()}
                      maxDate={addMonths(new Date(), 1)}
                      minTime={setHours(setMinutes(new Date(), 0), 11)}
                      maxTime={setHours(setMinutes(new Date(), 30), 20)}
                      onChange={onChangeArrivalTime}
                      dateFormat="dd-MM-yyyy HH:mm"
                      filterTime={filterPassedTime}
                      selected={selectedDate}
                    ></DatePicker>
                  )}
                </p>
                <p>
                  {!startUpdateVisible && (
                    <>Arrival Time: {booking.arrivalTime}</>
                  )}
                </p>
                <p>
                  Status:
                  {!startUpdateVisible && booking.status}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <select
                      onChange={handleStatusChange}
                      value={
                        inputValueUpdate.status
                          ? inputValueUpdate.status
                          : booking.status
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancel">cancel</option>
                      <option value="cancel">completed</option>
                    </select>
                  )}
                </p>
                {!startUpdateVisible && (
                  <button onClick={() => startUpdate(booking.id)}>
                    Update
                  </button>
                )}
                {startUpdateVisible && bookingUpdate == booking.id && (
                  <button
                    onClick={(e) => submitUpdate(e, booking.id)}
                    disabled={
                      startUpdateVisible && bookingUpdate !== booking.id
                    }
                  >
                    Confirm Update
                  </button>
                )}
                {startUpdateVisible && bookingUpdate == booking.id && (
                  <button
                    onClick={(e) => cancelUpdate(e, booking.id)}
                    disabled={
                      startUpdateVisible && bookingUpdate !== booking.id
                    }
                  >
                    cancel
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <NotificationContainer />
    </div>
  );
};

export default ReservationInfo;
