import { useState } from "react";
import CreateBooking from "../components/CreateBooking";
import CheckReservation from "../components/CheckReservation";
import { useMutation } from "@apollo/client";

const Reservation = () => {
  const [checkReservationVisible, setCheckReservationVisible] = useState(false);
 
  const checkReservation = () => {
    setCheckReservationVisible(true);
  };
  const cancelCheck = () => {
    setCheckReservationVisible(false);
  };

  return (
    <>
      <div className="button-bar">
        <div className={"check-reservation"} onClick={checkReservation}>
          Already Has Booking?
        </div>
        <div className={"cancel-check"} onClick={cancelCheck}>
          Back to Booking
        </div>
      </div>
      <div className='create-booking-form'>
        {!checkReservationVisible && <CreateBooking />}
        {checkReservationVisible && <CheckReservation setCheckReservationVisible={setCheckReservationVisible} />}
        
      </div>
    </>
    // {checkReservationVisible && (
    //   <>
    //     <div className="check-reservation-table">
    //       Contact Number:{" "}
    //       <input
    //         type="text"
    //         id="search-contact-number"
    //         required
    //         onChange={()=>handleSearchContactNumber}
    //         value={searchContactNumber}
    //       />
    //     </div>
    //   </>
    // )}
    // <div className="button-bar">
    //   {!checkReservationVisible && (
    //     <>
    //       <button
    //         className={"submit-reservation"}
    //         onClick={submitReservation}
    //         type='submit'
    //       >
    //         Make a Booking
    //       </button>
    //       <button className={"check-reservation"} onClick={checkReservation}>
    //         Already Has Booking?
    //       </button>
    //     </>
    //   )}
    //   {checkReservationVisible && (
    //     <>
    //       <button className={"check-reservation"} type="submit" onClick={checkReservation}>
    //         Search Reservation
    //       </button>
    //
    //     </>
    //   )}
    // </div>
  );
};
export default Reservation;
