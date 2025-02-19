import React, { useState, useEffect } from "react";
import "./App.css";
import Reservation from "./components/ReservationBoard";
function App() {
  const [isStarted, setIsStarted] = useState(false);
  const startreservation = () => {
    console.log("aaa");
    setIsStarted(true);
  };
  useEffect(() => {}, [isStarted]);
  return (
    <div className="App">
      <header className={`${isStarted ? "reservation-header" : "App-header"} `}>
        <h3 className="title" onClick={startreservation}>
          Hilton Restaurant {`${isStarted ? "" : "Start Reservation"} `}
        </h3>
      </header>
      <div className="board">{isStarted && <Reservation />}</div>
    </div>
  );
}

export default App;
