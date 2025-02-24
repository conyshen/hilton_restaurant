import { useState, useEffect } from "react";
import { inputValueProps, InputError } from "../types/types";
import { config } from "../config";
import { CREATE_BOOKING } from "../api/graphql/queries";
import { useMutation } from "@apollo/client";
import { getParsedDate } from "../utils/utils";
import DatePicker from "react-datepicker";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import {
  format,
  addMonths,
  setHours,
  setMinutes,
  parse,
  fromUnixTime,
} from "date-fns";
const CreateBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getParsedDate);
  const [inputValue, setInputValue] = useState<inputValueProps>({
    guestName: "",
    contact: "",
    arrivalDate: format(new Date(), "dd-MM-yyyy"),
    arrivalTime: format(
      fromUnixTime(Math.floor(new Date().getTime() / 1000)),
      "hh:mm"
    ),
    tableSize: 1,
    status: "pending",
  });

  useEffect(() => {
    setInputValue((prev) => ({
      ...prev,
      arrivalDate: format(selectedDate, "dd-MM-yyyy"),
      arrivalTime: format(
        fromUnixTime(Math.floor(selectedDate.getTime() / 1000)),
        "hh:mm"
      ),
    }));
  }, [selectedDate]);

  const [errors, setErrors] = useState<InputError>({
    tableSizeError: "",
    contactError: "",
  });
  const [createBookingAPI, { loading, error, data }] =
    useMutation(CREATE_BOOKING);
  const handleGuestName = (e: any) => {
    setInputValue((prev) => ({ ...prev, guestName: e.target.value }));
  };

  const handleTableSize = (e: any) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numberValue = parseInt(value, 10);
      if (numberValue >= 1 && numberValue <= 15) {
        setInputValue((prev) => ({ ...prev, tableSize: numberValue }));
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

  const filterPassedTime = (time: Date) => {
    if (!selectedDate) return true;
    const now = new Date();
    const isSameDay = selectedDate.toDateString() === now.toDateString();
    if (isSameDay) {
      return time.getTime() > now.getTime();
    }
    return true;
  };

  const handlecontactChange = (e: any) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue((prev) => ({ ...prev, contact: value }));
      setErrors((prev) => ({ ...prev, contactError: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        contactError: "Contact number must only contain digits",
      }));
    }
  };

  const onChangeArrivalTime = (e: any) => {
    setSelectedDate(e);
  };

  const submitReservation = (e: any) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Call the GraphQL mutation when the form is submitted
      await createBookingAPI({
        variables: {
          guestName: inputValue.guestName,
          contact: inputValue.contact,
          arrivalDate: inputValue.arrivalDate,
          arrivalTime: inputValue.arrivalTime,
          tableSize: inputValue.tableSize,
          status: inputValue.status,
        },
      }).then((res: any) => {
        if (res.data.createBooking.id) {
          NotificationManager.success(
            `booking id: ${res.data.createBooking.id}`,
            "Booking created"
          );
        }
      });
    } catch (err) {
      NotificationManager.error("Booking create failed");
      console.error("Error creating Booking:", err);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="reservation-table">
          <div>
            Guest Name:
            <input
              type="text"
              id="guest-name"
              value={inputValue.guestName}
              required
              onChange={handleGuestName}
            />
          </div>
          <div>
            Contact Number:
            <input
              type="text"
              id="contact-number"
              onChange={handlecontactChange}
              value={inputValue.contact}
              required
            />
            {errors.contactError && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {errors.contactError}
              </div>
            )}
          </div>

          <div>
            Expected Arrival Time:
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
          </div>
          <div>
            Table Size:
            <input
              type="number"
              id="table-size"
              required
              max={config.reservation.tableSizeMax}
              min={config.reservation.tableSizeMin}
              onChange={handleTableSize}
              value={inputValue.tableSize}
            />
            {errors.tableSizeError && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {errors.tableSizeError}
              </div>
            )}
          </div>
          <div>
            <button className={"submit-reservation"} type="submit">
              Make a booking
            </button>
          </div>
        </div>
      </form>
      <NotificationContainer />
    </>
  );
};

export default CreateBooking;
