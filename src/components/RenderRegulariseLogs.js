import React from "react";
import { PiArrowDownLeftLight } from "react-icons/pi";
import { RxArrowTopRight } from "react-icons/rx";
const RenderClockInAndOut = ({ clock }) => {
  if (!clock) {
    return (
      <div className="punch-details">
        <div className="punch-in">
          <h3 style={{ borderRight: "1px solid rgb(227, 221, 221)" }}>
            <PiArrowDownLeftLight
              style={{
                color: "green",
                fontSize: "16px",
                marginRight: "3px",
              }}
            />
            IN
          </h3>
          <h3>Missing</h3>
        </div>
        <div className="punch-out">
          <h3 style={{ borderRight: "1px solid rgb(227, 221, 221)" }}>
            <RxArrowTopRight
              style={{
                color: "red",
                fontSize: "16px",
                marginRight: "0px",
              }}
            />{" "}
            Out
          </h3>
          <h3>Missing</h3>
        </div>
      </div>
    );
  }

  const clockIn = [];
  const clockOut = [];

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  for (let i = 0; i < clock.length; i++) {
    if (i % 2 === 0) {
      clockIn.push(formatTime(clock[i]));
    } else {
      if (clock[i]) {
        clockOut.push(formatTime(clock[i]));
      } else {
        clockIn.push("Missing out");
      }
    }
  }

  const result = [];

  for (let i = 0; i < clockIn.length; i++) {
    result.push(
      <div className="punch-details" key={i}>
        <div className="punch-in">
          <h3 style={{ borderRight: "1px solid rgb(227, 221, 221)" }}>
            <PiArrowDownLeftLight
              style={{
                color: "green",
                fontSize: "16px",
                marginRight: "3px",
              }}
            />
            IN
          </h3>
          <h3>{clockIn[i]}</h3>
        </div>
        <div className="punch-out">
          <h3 style={{ borderRight: "1px solid rgb(227, 221, 221)" }}>
            <RxArrowTopRight
              style={{
                color: "red",
                fontSize: "16px",
                marginRight: "0px",
              }}
            />{" "}
            OUT
          </h3>
          <h3>{clockOut[i] || "Missing"}</h3>
        </div>
      </div>
    );
  }
  return result;
};
export default RenderClockInAndOut;
