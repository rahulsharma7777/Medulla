import react from "react";
import moment from "moment";
export const getFormattedTime = (times) => {
  const timestamp = new Date(times);

  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  let hoursAMPM;
  if (hours === 0) {
    hoursAMPM = 12;
  } else if (hours > 12) {
    hoursAMPM = hours - 12;
  } else {
    hoursAMPM = hours;
  }
  const ampm = hours < 12 ? "AM" : "PM";

  const timeAMPM = `${hoursAMPM}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
  return timeAMPM;
};

export const getCombinedDifference = (startTime, endTime) => {
  endTime = moment(endTime);
  startTime = moment(startTime);

  let duration = moment.duration(endTime.diff(startTime));
  let hours = Math.floor(duration.asHours());
  let minutes = duration.minutes();

  return `${hours}h ${minutes}m`;
};
export const formattedLocalDate = (date) => {
  const utcDate = moment.utc(date);
  const localDate = utcDate.local();
  const localDateTimeString = localDate.format("MMM DD, ddd");
  return localDateTimeString;
};
export const isTimeBetween = (startTime, endTime, checkTime) => {
  const checkMoment = moment(checkTime);
  let check;

  if (moment(checkTime).day() !== moment().day()) {
    check = moment(endTime).set({
      hour: checkMoment._i.hour(),
      minute: checkMoment._i.minute(),
      second: checkMoment._i.second(),
    });
  } else {
    check = moment(startTime).set({
      hour: checkMoment._i.hour(),
      minute: checkMoment._i.minute(),
      second: checkMoment._i.second(),
    });
  }

  return check.isBetween(startTime, endTime);
};
export const addMinutesToIST = (utcTime, minutesToAdd) => {
  const utcDate = new Date(utcTime);
  const hours = utcDate.getHours();
  let minutes = utcDate.getMinutes() + minutesToAdd;
  const extraHours = Math.floor(minutes / 60);
  const updatedHours = (hours + extraHours) % 24;
  minutes = minutes % 60;

  const ampm = updatedHours >= 12 ? "PM" : "AM";
  const formattedHours = updatedHours % 12 || 12;

  const istTimeAMPM = `${formattedHours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;

  return istTimeAMPM;
};
export const subtractMinutesFromIST = (utcTime, minutesToSubtract) => {
  const utcDate = new Date(utcTime);
  let hours = utcDate.getHours();
  let minutes = utcDate.getMinutes() - minutesToSubtract;
  if (minutes < 0) {
    const borrowHours = Math.ceil(Math.abs(minutes) / 60);
    hours -= borrowHours;
    minutes += borrowHours * 60;
  }
  hours = (hours + 24) % 24;

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  const istTimeAMPM = `${formattedHours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;

  return istTimeAMPM;
};
