import React from "react";
import { ViewProps } from "../types/types";
import Reservation from "./Reservation";
import ReservationInfo from "./ReservationInfo";
const RouteHanlder = (props: ViewProps) => {
  const { customerView, employeeView } = props;
  return (
    <div className="board">
      {customerView && <Reservation />}
      {employeeView && <ReservationInfo />}
    </div>
  );
};

export default RouteHanlder;
