import React, { useState, useEffect } from "react";
import "./App.css";
import RouteHanlder from "./pages/RouteHanlder";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.module.css";
import 'react-notifications/lib/notifications.css';

function App() {
  const [view, setView] = useState({
    customerView: false,
    employeeView: false,
  });
  const [isStarted, setIsStarted] = useState(false);
  const hanldeView = (view: string) => {
    if (view === "customer") {
      setView({ customerView: true, employeeView: false });
    } else if (view === "employee") {
      setView({ customerView: false, employeeView: true });
    }
    setIsStarted(true);
  };
  const handleBack = () => {
    setView({
      customerView: false,
      employeeView: false,
    });
    setIsStarted(false);
  };
  return (
    <div className="App">
      <div
        className={`${
          isStarted ? "d-flex justify-content-between" : "d-block"
        } `}
      >
        <header
          className={`${isStarted ? "reservation-header" : "App-header"} `}
        >
          <h3 className="title" onClick={() => hanldeView("customer")}>
            {!view.employeeView && <>Customer Reservation </>}
            {`${isStarted ? "" : "Start Reservation"} `}
          </h3>
          <h3 className="title" onClick={() => hanldeView("employee")}>
            {!view.customerView && <>Employee Dashboard</>}
          </h3>
        </header>
        {isStarted && (
          <div className="back-btn" onClick={handleBack}>
            Back
          </div>
        )}
      </div>
      {isStarted && (
        <RouteHanlder
          customerView={view.customerView}
          employeeView={view.employeeView}
        />
      )}
    </div>
  );
}

export default App;
