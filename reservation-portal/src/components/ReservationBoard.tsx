import react, { useState } from "react";
import styled from "style-components";
import Reservation from "./Reservation";
import ReservationResult from "./ReservationResult";
import Locations from "./Locations";

import "../App.css";

const ReservationBoard = () => {
  const [isReserved, setIsReserved] = useState(false);
  return (
    <>
      {isReserved && <></>}
      {!isReserved && (
        <div className="reservation-board">
          <Reservation />
          <ReservationResult />
        </div>
      )}
    </>
  );
};
export default ReservationBoard;
