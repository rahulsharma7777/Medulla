import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Progress } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { MdInfoOutline } from "react-icons/md";
import moment from "moment";
import { Button, Tooltip } from "antd";
import ApplyRegularise from "../components/ApplyRegularise";
import ApplyPartialDay from "../components/ApplyPartialDay";
import AttendenceRecord from "../pages/AttendenceRecord.js";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice.js";
import { getLogs, getUserLogs, getSubadminUserShift } from "../services/Index";
import { getFormattedTime } from "../components/common/Timerfunctions.js";
import {
  getCombinedDifference,
  formattedLocalDate,
} from "../components/common/Timerfunctions.js";
const UserAttendenceLogs = ({
  isUser,
  setEffectiveHours,
  setGrossHours,
  toggleClockInOut,
  setToggleClockInOut,
  setLastLogin,
}) => {
  const [logs1, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthSelector, setMonthSelector] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPartialDay, setIsOpenPartialDay] = useState(false);
  const [toggleClick, setToggleClick] = useState(true);
  const [isLogs, setIsLogs] = useState(true);
  const [modalDate, setModalDate] = useState("");
  const [regulariseDate, setRegulariseDate] = useState("");
  const location = useLocation();
  const [last30days, setLast30Days] = useState("");
  const [duration, setDuration] = useState(null);
  const [usersShift, SetUsersShift] = useState(null);
  const shift = useSelector((state) => state.shiftDetails.shift);

  const checkPath = location.pathname === "/me/attendence";
  const getUSerId = () => {
    id = localStorage.getItem("USER_ID");
  };

  let { id } = useParams();

  if (!id) {
    getUSerId();
  }

  const dispatch = useDispatch();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function getFormattedDate(dateString) {
    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
  }
  const getCurrentDate = () => {
    const now = moment();

    now.set({ hour: 23, minute: 59, second: 0, millisecond: 0 });

    const formattedDate = now.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    return formattedDate;
  };

  const getShiftofUser = async () => {
    const res = await getSubadminUserShift(id);

    SetUsersShift(res.data.shift_id);
  };

  useEffect(() => {
    setCurrentDate(getCurrentDate());
  }, []);
  useEffect(() => {
    const getPrevious30Day = (dateString) => {
      const thirtyDaysAgo = moment().subtract(30, "days");

      return thirtyDaysAgo.toISOString();
    };
    setFromDate(getPrevious30Day());
  }, []);
  useEffect(() => {
    if (shift && checkPath) {
      setDuration(getCombinedDifference(shift?.startTime, shift?.endTime));
    }
    if (usersShift) {
      setDuration(
        getCombinedDifference(usersShift?.startTime, usersShift?.endTime)
      );
    }
  }, [shift, usersShift]);
  useEffect(() => {
    if (!checkPath) {
      getShiftofUser();
    }
  }, [id]);
  function calculatePercentage(grossHours) {
    if (duration) {
      const [hoursString, minutesString] = duration.split(" ");
      const hours = parseInt(hoursString);
      const minutes = parseInt(minutesString);
      const totalMinutes = hours * 60 + minutes;
      const date = new Date(grossHours);
      const hours2 = date.getUTCHours();
      const minutes2 = date.getUTCMinutes();
      const totalMinutes2 = hours2 * 60 + minutes2;
      const ratio = totalMinutes2 / totalMinutes;
      const percentage = Math.round(ratio * 100);

      return percentage;
    }
  }
  async function getDetails() {
    try {
      dispatch(showLoader());
      if (fromDate && currentDate) {
        const res = await getLogs(fromDate, currentDate, id);
        const logsData = res?.data?.data;
        const reversedLogsData = logsData.reverse();
        setLogs(reversedLogsData);
        setLast30Days(reversedLogsData);
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
  async function getUserDetails() {
    try {
      dispatch(showLoader());
      if (fromDate && currentDate) {
        const res = await getUserLogs(fromDate, currentDate, id);
        const logsData = res?.data?.data;
        const reversedLogsData = logsData.reverse();
        setLogs(reversedLogsData);
        setLast30Days(reversedLogsData);
        if (reversedLogsData[0].log) {
          if (
            reversedLogsData[0].log.clock.length === 0 ||
            reversedLogsData[0].log.clock.length % 2 === 0
          ) {
            setToggleClockInOut(false);
          } else {
            setToggleClockInOut(true);
          }

          const effectiveHours = reversedLogsData[0]?.log?.effectiveHours;
          const date = new Date(effectiveHours);
          const hours = date.getUTCHours();
          const minutes = date.getUTCMinutes();
          const formattedTime = `${hours}h ${minutes}m`;
          setEffectiveHours(formattedTime);
          setGrossHours(formattedTime);
          const length = reversedLogsData[0]?.log.clock.length;

          setLastLogin(
            getTimeDifference(reversedLogsData[0]?.log.clock[length - 1])
          );
        } else {
          let filledLogEntryIndex = false;
          for (let i = 1; i <= 3; i++) {
            const nextEntry = reversedLogsData[i];
            if (nextEntry && nextEntry?.log) {
              filledLogEntryIndex = true;
              if (
                nextEntry.log.clock.length === 0 ||
                nextEntry.log.clock.length % 2 === 0
              ) {
                setToggleClockInOut(false);
              } else {
                setToggleClockInOut(true);
              }
              if (toggleClockInOut) {
                const effectiveHours = nextEntry?.log?.effectiveHours;
                const date = new Date(effectiveHours);
                const hours = date.getUTCHours();
                const minutes = date.getUTCMinutes();
                const formattedTime = `${hours}h ${minutes}m`;
                setEffectiveHours(formattedTime);
                setGrossHours(formattedTime);
                const length = nextEntry?.log.clock.length;

                setLastLogin(
                  getTimeDifference(nextEntry?.log.clock[length - 1])
                );
              }
            }
            if (filledLogEntryIndex) {
              break;
            }
          }
        }
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
  useEffect(() => {
    if (isUser) {
      getUserDetails();
    } else {
      getDetails();
    }
  }, [id, fromDate, currentDate, toggleClockInOut]);
  const hours = (log) => {
    const date = new Date(log);
    const hours = date.getUTCHours();
    return hours;
  };
  const minutes = (log) => {
    const date = new Date(log);
    const minutes = date.getUTCMinutes();
    return minutes;
  };
  const percentage = (log) => {
    const date = new Date(log);
    const hours = date.getUTCHours();

    return (hours / 9) * 100;
  };
  const checkLogs = (logs) => {
    if (logs.length > 1) {
      return true;
    }
    return false;
  };

  const handle30Days = () => {
    setLogs(last30days);
  };

  async function getMonthList(startingDate, endingDate) {
    try {
      dispatch(showLoader());
      const res = await getUserLogs(startingDate, endingDate, id);

      return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(hideLoader());
    }
  }
  const handleMonthClick = async (monthIndex) => {
    setSelectedMonth(monthIndex);
    setMonthSelector(true);

    const currentYear = new Date().getFullYear();
    const startingDate = new Date(
      Date.UTC(currentYear, monthIndex, 1)
    ).toISOString();
    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    const endingDate = new Date(currentYear, monthIndex + 1, 1);
    endingDate.setDate(endingDate.getDate() - 1);

    if (monthIndex === 1 && isLeapYear(currentYear)) {
      endingDate.setDate(29);
    }
    endingDate.setDate(endingDate.getDate() + 1);

    const formattedNextDay = endingDate.toISOString();
    const res = await getMonthList(startingDate, formattedNextDay);
    const logsData = res?.data?.data;
    const reversedLogsData = logsData.reverse();
    setLogs(reversedLogsData);
  };

  const renderMonths = () => {
    const currentMonthIndex = new Date().getMonth();
    const previousMonths = [];
    for (let i = 1; i <= 6; i++) {
      const prevMonthIndex = (currentMonthIndex - i + 12) % 12;
      previousMonths.push(prevMonthIndex);
    }
    return previousMonths.map((monthIndex, index) => {
      const abbreviatedMonth = months[monthIndex].substring(0, 3);
      const uniqueKey = `month-${monthIndex}-${index}`;
      return (
        <li
          key={uniqueKey}
          onClick={() => handleMonthClick(monthIndex)}
          className={selectedMonth === monthIndex ? "active" : ""}
        >
          {abbreviatedMonth}
        </li>
      );
    });
  };

  const transformDateToIST = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = date.toLocaleString("en-us", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", { hour12: false });
    const formattedDate = `${dayOfWeek} ${month} ${day} ${year} ${time} GMT+0530 (India Standard Time)`;

    return formattedDate;
  };

  function formatArrivalTime(log) {
    const timestamp = log?.arrival;
    const date = new Date(timestamp);
    const late = log?.late;
    if (late === 0) {
      return "on time";
    }
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    const formattedTime = `${hours}:${minutes}:${seconds} late`;

    return formattedTime;
  }

  const handlePartialDay = (log) => {
    setModalDate(transformDateToIST(log.date));
    setIsOpenPartialDay(true);
    setIsOpen(false);
  };
  const handleRegularize = (log) => {
    setRegulariseDate(transformDateToIST(log.date));
    setIsOpen(true);
    setIsOpenPartialDay(false);
  };
  const handleLogsClick = (value) => {
    if (value === 1) {
      setToggleClick(true);
      setIsLogs(true);
    } else {
      setToggleClick(false);
      setIsLogs(false);
    }
  };
  function getTimeDifference(time1) {
    const givenTime = moment.utc(time1);
    const currentTime = moment.utc();
    const diffInMilliseconds = Math.abs(currentTime.diff(givenTime));
    const diffDuration = moment.duration(diffInMilliseconds);
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();
    const formattedTime = `${hours}h:${minutes}m`;

    return formattedTime;
  }

  return (
    <div className="attendance">
      <div className="title">
        <h2
          className={`logs ${toggleClick ? "current-color " : ""}`}
          onClick={() => handleLogsClick(1)}
        >
          Logs
        </h2>
        <h2
          className={`request ${!toggleClick ? "current-color " : ""}`}
          onClick={() => handleLogsClick(2)}
        >
          Attendence request
        </h2>
      </div>
      {isLogs && (
        <div className="attendance-logs">
          <div className="attendance-logs-month">
            <h3 className="cursor-pointers 30-days">Last 30 days</h3>
            <div className="months cursor-pointers">
              <ul>
                <li
                  className={!monthSelector ? "active" : ""}
                  onClick={() => {
                    setSelectedMonth(null);
                    setMonthSelector(false);
                    handle30Days();
                  }}
                >
                  30 days
                </li>
                {renderMonths()}
              </ul>
            </div>
          </div>
          <div className="attendance-logs-header">
            <div className="heading">
              <h4>date</h4>
            </div>
            <div className="heading attendance-visuals">
              <h4>attendance visuals</h4>
            </div>
            <div className="heading">
              <h4>effective hours</h4>
            </div>
            <div className="heading">
              <h4>gross hours</h4>
            </div>
            <div className="heading">
              <h4>arrival</h4>
            </div>
            <div className="heading">
              <h4>log</h4>
            </div>
          </div>
          {logs1?.map((log) => (
            <div
              key={log._id}
              className={`attendance-logs-data ${
                (log.status === 0 && "weekly-off") ||
                (log.status === 2 &&
                  log.leave.status === 1 &&
                  log.leave.sub_leaveType === 0 &&
                  "general-leave") ||
                (log.status === 4 && "organization-off") ||
                (log.status === 1 && "default-color") ||
                ((log.status === 5 ||
                  (log.status === 6 && log.regularize.status === 1)) &&
                  "no-logged-entries") ||
                ""
              }`}
            >
              <div className="data attendanceday-date">
                <p>{formattedLocalDate(log.date)}</p>
                {(log.status === 0 ||
                  (log.status === 2 &&
                    log.leave.status === 1 &&
                    log.leave.sub_leaveType === 0) ||
                  log.status === 4 ||
                  (log.status === 2 &&
                    log.leave.status === 1 &&
                    log.leave.sub_leaveType === 1) ||
                  (log.status === 6 && log.regularize.status === 1) ||
                  (log.status === 1 && log?.regularize?.status === 1) ||
                  (log.status === 3 && log.leave.status === 1)) && (
                  <Tooltip
                    title={
                      log.status === 0
                        ? "Weekly Off"
                        : log.status === 2 &&
                          log.leave.status === 1 &&
                          log.leave.sub_leaveType === 0
                        ? "Leave"
                        : log.status === 2 &&
                          log.leave.status === 1 &&
                          log.leave.sub_leaveType === 1
                        ? "H Day"
                        : log.status === 4
                        ? "Holiday"
                        : log.status === 6 && log.regularize.status === 1
                        ? "REG"
                        : log.status === 1 && log?.regularize?.status === 1
                        ? "REG"
                        : log.status === 3 && log.leave.status === 1
                        ? "Partial Day"
                        : ""
                    }
                    overlayStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      color: "white",
                    }}
                    key={
                      log.status === 0
                        ? "lightpurple"
                        : log.status === 2 &&
                          log.leave.status === 1 &&
                          log.leave.sub_leaveType === 0
                        ? "lightgreen"
                        : log.status === 2 &&
                          log.leave.status === 1 &&
                          log.leave.sub_leaveType === 1
                        ? "H Day"
                        : log.status === 4
                        ? "lightpink"
                        : log.status === 1 && log?.regularize?.status === 1
                        ? "REG"
                        : log.status === 6 && log.regularize.status === 1
                        ? "REG"
                        : log.status === 3 && log.leave.status === 1
                        ? "lightyellow"
                        : ""
                    }
                  >
                    <Button
                      size="small"
                      style={{
                        backgroundColor:
                          log.status === 0
                            ? "#2aa71c6e"
                            : log.status === 2 && log.leave.sub_leaveType === 0
                            ? "#6138c944"
                            : log.status === 2 && log.leave.sub_leaveType === 1
                            ? "#6138c944"
                            : log.status === 4
                            ? "lightpink"
                            : log.status === 6 && log.regularize.status === 1
                            ? "#047f94"
                            : log.status === 1 && log?.regularize?.status === 1
                            ? "#047f94"
                            : log.status === 3
                            ? "#b8b82ada"
                            : "",
                        color: "#fff",
                        fontWeight: "400",
                        fontSize: "10px",
                        padding: "4px 6px",
                      }}
                    >
                      {log.status === 0
                        ? "W OFF"
                        : log.status === 2 && log.leave.sub_leaveType === 0
                        ? "LEAVE"
                        : log.status === 2 && log.leave.sub_leaveType === 1
                        ? "H DAY"
                        : log.status === 4
                        ? "HOLIDAY"
                        : log.status === 6 && log.regularize.status === 1
                        ? "REG"
                        : log.status === 1 && log.regularize.status === 1
                        ? "REG"
                        : log.status === 3
                        ? "PARTIAL DAY"
                        : ""}
                    </Button>
                  </Tooltip>
                )}
              </div>
              <div className="attendence-bar">
                {(log.status === 1 ||
                  (log.status === 6 && log.log) ||
                  (log.status === 3 && log.log) ||
                  (log.status === 2 &&
                    log.leave.sub_leaveType === 1 &&
                    log.log)) && (
                  <Progress
                    percent={calculatePercentage(log?.log?.effectiveHours)}
                    showInfo={false}
                    size={[150, 10]}
                    strokeColor="#2986ce"
                  />
                )}
              </div>
              <div className="data">
                {log.status === 1 ||
                (log.status === 3 && log.log) ||
                (log.status === 2 &&
                  log.leave.sub_leaveType === 1 &&
                  log.log) ? (
                  <p className="data-flex" style={{ gap: "3px" }}>
                    <div className="hour-circle-section">
                      <div
                        className="hour-circle"
                        style={{
                          height: percentage(log?.log?.effectiveHours) + "%",
                        }}
                      ></div>
                    </div>
                    {hours(log?.log?.effectiveHours)}h{" "}
                    {minutes(log?.log?.effectiveHours)}m
                  </p>
                ) : (
                  <p>
                    {log.status === 0 && "Weekly Off"}
                    {log.status === 2 &&
                      log.leave.sub_leaveType === 1 &&
                      !log.log &&
                      "No Logged Entries"}
                    {log.status === 2 &&
                      log.leave.status === 1 &&
                      log.leave.sub_leaveType === 0 &&
                      "Leave"}
                    {log.status === 3 && !log.log && "No Logged Entries"}
                    {log.status === 4 && "Organisation Holiday"}
                    {log.status === 5 && "No Logged Entries"}
                    {((log.status === 6 && !log?.log?.clock) ||
                      (log.status === 2 && log.leave.status !== 1)) &&
                      "No Logged Entries"}
                  </p>
                )}
              </div>
              <div className="data">
                {log.status === 1 ||
                (log.status === 3 && log.log) ||
                (log.status === 2 &&
                  log.leave.sub_leaveType === 1 &&
                  log.log) ? (
                  <p>
                    {hours(log?.log?.grossHours)}h{" "}
                    {minutes(log?.log?.grossHours)}m
                  </p>
                ) : (
                  <p></p>
                )}
              </div>
              <div className="data">
                {log.status === 1 ||
                (log?.status === 3 && log.log) ||
                (log.status === 2 &&
                  log.leave.sub_leaveType === 1 &&
                  log.log) ? (
                  <p>{formatArrivalTime(log.log)}</p>
                ) : (
                  <p></p>
                )}
              </div>
              {((log.status === 1 && !log?.log?.exceed) ||
                (log.status === 3 && log?.log) ||
                (log.status === 2 &&
                  log.leave.sub_leaveType === 1 &&
                  log.log)) &&
              log?.log.clock.length > 1 ? (
                <Tooltip
                  overlayStyle={{
                    width: "200px",
                    height: "150px",
                    backgroundColor: "#eff2f8",
                    border: "1px solid #ccc",
                  }}
                  overlayInnerStyle={{
                    height: "100%",
                    fontSize: "16px",
                    textAlign: "center",
                    backgroundColor: "#eff2f8",
                  }}
                  title={
                    <div
                      style={{
                        height: "100%",
                        fontSize: "16px",
                        textAlign: "center",
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="shifts-data"
                        style={{ flex: "0.5", fontSize: "13px" }}
                      >
                        {shift?.name}({getFormattedDate(log.date)})
                        <p>
                          {getFormattedTime(shift?.startTime)} to{" "}
                          {getFormattedTime(shift?.endTime)}
                        </p>
                      </div>
                      <div
                        className="text2"
                        style={{ marginTop: "15px" }}
                        onClick={() => handlePartialDay(log)}
                      >
                        Apply Partial Day
                      </div>
                      <div
                        className="text2"
                        style={{ marginTop: "5px" }}
                        onClick={() => handleRegularize(log)}
                      >
                        Regularize
                      </div>
                    </div>
                  }
                  trigger={checkPath ? ["hover", "click"] : []}
                  arrow={false}
                  placement="right"
                >
                  <div
                    className="data logs"
                    style={
                      checkLogs(log?.log?.clock[0]) ? { color: "#86c06a" } : {}
                    }
                  >
                    <MdInfoOutline />
                  </div>
                </Tooltip>
              ) : log.status === 1 ||
                log.status === 5 ||
                log.status === 3 ||
                (log.status === 1 && log.log.exceed) ||
                (log.status === 2 && log.leave.sub_leaveType === 1) ? (
                <Tooltip
                  overlayStyle={{
                    width: "200px",
                    height: "150px",
                    backgroundColor: "#eff2f8",
                    border: "1px solid #ccc",
                  }}
                  overlayInnerStyle={{
                    height: "100%",
                    fontSize: "16px",
                    textAlign: "center",
                    backgroundColor: "#eff2f8",
                  }}
                  title={
                    <div
                      style={{
                        height: "100%",
                        fontSize: "16px",
                        textAlign: "center",
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="shifts-data"
                        style={{ flex: "0.5", fontSize: "13px" }}
                      >
                        {shift?.name}({getFormattedDate(log.date)})
                        <p>9:00am to 6:00am</p>
                      </div>
                      <div
                        className="text2"
                        style={{ marginTop: "15px" }}
                        onClick={() => handlePartialDay(log)}
                      >
                        Apply Partial Day
                      </div>
                      <div
                        className="text2"
                        style={{ marginTop: "5px" }}
                        onClick={() => handleRegularize(log)}
                      >
                        Regularize
                      </div>
                    </div>
                  }
                  trigger={checkPath ? ["hover", "click"] : []}
                  arrow={false}
                  placement="right"
                >
                  <div className="data logs">
                    <MdInfoOutline />
                  </div>
                </Tooltip>
              ) : (
                <div className="data logs"></div>
              )}
            </div>
          ))}
          <ApplyRegularise
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            Dateof={regulariseDate}
          />
          <ApplyPartialDay
            isOpen={isOpenPartialDay}
            onClose={() => setIsOpenPartialDay(false)}
            applyDate={modalDate}
          />
        </div>
      )}
      {!isLogs && <AttendenceRecord />}
    </div>
  );
};

export default UserAttendenceLogs;
