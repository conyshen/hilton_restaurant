import react, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { config } from "../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.module.css";
import { setHours } from "date-fns/setHours";
import { setMinutes } from "date-fns/setMinutes";
import { addMonths } from "date-fns/addMonths";

interface inputValueProps {
  location: string;
  name: string;
  contact: string;
  date: string;
  arrivalTime: string;
  arrivalDate: string;
  tableSize: number;
}
const Reservation = () => {
  const inputValue: inputValueProps = {
    location: "",
    name: "",
    contact: "",
    arrivalDate: format(new Date(), "dd-mm-yyyy"),
    arrivalTime: format(new Date().getTime(), "mm:ss"),
    tableSize: 0,
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [checkReservationVisible, setCheckReservationVisible] = useState(false);

  const filterPassedTime = (time: Date) => {
    if (!selectedDate) return true; // If no date is selected, allow all times
    const now = new Date();

    // Check if the selected date is today
    const isSameDay = selectedDate.toDateString() === now.toDateString();
    if (isSameDay) {
      // If today, only allow future times
      return time.getTime() > now.getTime();
    }

    // If it's a future date, allow all times
    return true;
  };
  const submitReservation = () => {};
  const onChangeArrivalTime = (date: Date) => {
    setSelectedDate(date);
  };
  const checkReservation = () => {
    setCheckReservationVisible(true);
  };
  const cancelCheck = () => {
    setCheckReservationVisible(false);
  };

  return (
    <div className="reservation">
      {!checkReservationVisible && (
        <>
          <div className="location-bar">
            Location:
            <select name="restaurant-location" id="restaurant-location">
              <option value="shanghai">Shanghai</option>
              <option value="suzhou">Suzhou</option>
              <option value="hangzhou">Hangzhou</option>
            </select>
          </div>
          <div className="reservation-table">
            <div>
              Guest Name: <input type="text" id="guest-name" required />
            </div>
            <div>
              Contact Number: <input type="text" id="contact-number" required />
            </div>
            <div>
              Expected Arrival Time:
              <DatePicker
                showTimeSelect
                selected={selectedDate}
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                minDate={new Date()}
                maxDate={addMonths(new Date(), 1)}
                minTime={setHours(setMinutes(new Date(), 0), 11)}
                maxTime={setHours(setMinutes(new Date(), 30), 20)}
                onChange={() => onChangeArrivalTime}
                dateFormat="dd-MM-yyyy HH:mm"
                filterTime={filterPassedTime}
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
              />
            </div>
          </div>
        </>
      )}
      {checkReservationVisible && (
        <>
          <div className="check-reservation-table">
            Contact Number: <input type="text" id="contact-number" required />
          </div>
        </>
      )}
      <div className="button-bar">
        {!checkReservationVisible && (
          <>
            <button
              className={"submit-reservation"}
              onClick={submitReservation}
            >
              Make a Booking
            </button>
            <button className={"check-reservation"} onClick={checkReservation}>
              Already Has Booking?
            </button>
          </>
        )}
        {checkReservationVisible && (
          <>
            <button className={"check-reservation"} onClick={checkReservation}>
              Search Reservation
            </button>
            <button className={"cancel-check"} onClick={cancelCheck}>
              Back to Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Reservation;
