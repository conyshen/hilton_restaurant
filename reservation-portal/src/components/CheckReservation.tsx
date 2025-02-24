import { ChangeEvent, useState, useEffect } from "react";
import { NotificationContainer } from "react-notifications";
import { useQuery, useMutation } from "@apollo/client";
import { inputValueUpdateProps, InputError } from "../types/types";
import { getParsedDate } from "../utils/utils";
import DatePicker from "react-datepicker";
import { NotificationManager } from "react-notifications";
import { config } from "../config";
import {
  LIST_BOOKINGS_BY_CONTACT_NUMBER,
  UPDATE_BOOKING,
} from "../api/graphql/queries";
import {
  format,
  addMonths,
  setHours,
  setMinutes,
  fromUnixTime,
} from "date-fns";
const CheckReservation = (props: any) => {
  const { setCheckReservationVisible } = props;
  const [contact, setContact] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [submit, setSubmit] = useState(false);
  const [errors, setErrors] = useState({ contactError: "" });
  const [startUpdateVisible, setStartUpdateVisible] = useState(false);
  const [bookingUpdate, setBookingUpdate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(getParsedDate);
  const startUpdate = (bookingId: string) => {
    setBookingUpdate(bookingId);
    setStartUpdateVisible(true);
  };
  const [inputValueUpdate, setInputValueUpdate] = useState<any>({
    tableSize: null,
    arrivalDate: null,
    arrivalTime: null,
    status: null,
  });
  const [updateReservationVisible, setUpdateReservationVisible] =
    useState<boolean>(false);

  const handleSearchContactNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(e.target.value)) {
      setContact(e.target.value);
    } else {
      setErrors((prev: any) => ({
        ...prev,
        contactError: "Contact number must only contain digits",
      }));
    }
  };

  const handleGuestName = (e: ChangeEvent<HTMLInputElement>) => {
    setGuestName(e.target.value);
  };

  const { loading, error, data } = useQuery(LIST_BOOKINGS_BY_CONTACT_NUMBER, {
    variables: {
      guestName,
      contact,
    },
    skip: !submit,
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
        setInputValueUpdate((prev: any) => ({
          ...prev,
          tableSize: numberValue,
        }));
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
    setInputValueUpdate((prev: any) => ({ ...prev, status: e.target.value }));
  };

  const onChangeArrivalTime = (e: any) => {
    setSelectedDate(e);
  };

  useEffect(() => {
    setInputValueUpdate((prev: any) => ({
      ...prev,
      arrivalDate: format(selectedDate, "dd-MM-yyyy"),
      arrivalTime: format(
        fromUnixTime(Math.floor(selectedDate.getTime() / 1000)),
        "hh:mm"
      ),
    }));
  }, [selectedDate]);

  const searchReservation = async (e: any) => {
    setSubmit(true);
  };
  const [updateBookingAPI] = useMutation(UPDATE_BOOKING);
  const submitUpdate = async (e: any, id: string, booking: any) => {
    e.preventDefault();
    try {
      await updateBookingAPI({
        variables: {
          id: id,
          bookingUpdate: {
            arrivalTime: inputValueUpdate.arrivalTime
              ? inputValueUpdate.arrivalTime
              : booking.arrivalTime,
            arrivalDate: inputValueUpdate.arrivalDate
              ? inputValueUpdate.arrivalDate
              : booking.arrivalDate,
            tableSize: inputValueUpdate.tableSize
              ? inputValueUpdate.tableSize
              : booking.tableSize,
            status: inputValueUpdate.status
              ? inputValueUpdate.status
              : booking.status,
          },
        },
      }).then((res) => {
        if (
          res.data.updateBookingById.id &&
          res.data.updateBookingById.id === id
        ) {
          NotificationManager.success(
            `booking id: ${res.data.updateBookingById.id}`,
            "Update Successfully"
          );
          setTimeout(() => {
            setCheckReservationVisible(false);
          }, 1000);
        }
      });
    } catch (e) {
      console.log();
    }
  };
  const cancelUpdate = (e: any, id: string) => {
    e.preventDefault();
    setStartUpdateVisible(false);
    id = "";
  };
  return (
    <>
      <div className="check-reservation-table">
        <div>
          Guest Name:
          <input
            type="text"
            id="guest-name"
            value={guestName}
            required
            onChange={handleGuestName}
          />
        </div>
        <div>
          Contact Number:
          <input
            type="text"
            id="search-contact-number"
            required
            onChange={handleSearchContactNumber}
            value={contact}
          />
        </div>
        <div>
          {errors.contactError && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {errors.contactError}
            </div>
          )}
        </div>
        <button
          className={"submit-reservation"}
          onClick={searchReservation}
          type="submit"
        >
          Submit
        </button>
      </div>
      <NotificationContainer />
      {data && (
        <>
          <h3>Booking Results</h3>
          <div className="reservation-block">
            {data?.listAllBookingByContactNumber?.map((booking: any) => (
              <div className="reservation-card" key={booking.id}>
                <p>Guest: {booking.guestName}</p>
                <p>Contact: {booking.contact}</p>
                <p>
                  Table Size:
                  {!startUpdateVisible && booking.tableSize}
                  {startUpdateVisible && bookingUpdate === booking.id && (
                    <input
                      value={
                        booking.tableSize
                          ? booking.tableSize
                          : inputValueUpdate.tableSize
                      }
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
                      selected={
                        // booking.tableSize ? booking.tableSize: inputValueUpdate.tableSize
                        selectedDate
                      }
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
                      <option value="completed">completed</option>
                      <option value="cancel">cancel</option>
                    </select>
                  )}
                </p>
                {!startUpdateVisible && (
                  <button onClick={() => startUpdate(booking.id)}>
                    Update
                  </button>
                )}
                {startUpdateVisible && (
                  <button
                    onClick={(e) => submitUpdate(e, booking.id, booking)}
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
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default CheckReservation;
