import { Card, Col, Flex, Progress, Row } from "antd";
import { toast } from "react-toastify";
import moment from "moment"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import UserIcon from "../Assests/Images/User-icon.png";
import TeamIcon from "../Assests/Images/Teams-icon.png";
import InfoIcon from "../Assests/Images/Info.png";
import DownArrow from "../Assests/Images/Down-arrow.png";
import Fingerprint from "../Assests/Images/Fingerprint.png";
import TrackingIcon from "../Assests/Images/Tracking-chart.png";
import Timer from "../components/Timer";
import {
  clockIn,
  clockOut,
  getShift,
  getWeeklyAttendance,
} from "../services/Index";
import UserAttendenceLogs from "./UserAttendenceLogs";
import ApplyPartialDay from "../components/ApplyPartialDay";
import { storeShiftDetails } from "../redux/slice/shiftSlice";
import { getFormattedTime } from "../components/common/Timerfunctions";
import { getCombinedDifference } from "../components/common/Timerfunctions";

const Attendence = () => {
  const [toggleClockInOut, setToggleClockInOut] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState(0);
  const [shiftEndTime, setShiftEndTime] = useState(0);
  const [shiftDuration, setShiftDuration] = useState(0);
  const [effectiveHours, setEffectiveHours] = useState("0h:0m");
  const [grossHours, setGrossHours] = useState("0h:0m");
  const [presentDate, setPresentDate] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [upDateLogs, setUpDateLogs] = useState(false);
  const [lastLogin, setLastLogin] = useState("");
  const [rearrangedDayLabels, setRearrangedDayLabels] = useState([]);
  const [userArrival, setUserArrival] = useState("0");
  const [TeamArrival, setTeamArrival] = useState("0");
  const [userAvgHours, setUserAvgHours] = useState("0h:0m");
  const [teamAvgHours, setTeamAvgHours] = useState("0h:0m");
  const dispatch = useDispatch();
  const onClockInClick = async (e) => {
    e.preventDefault();
  const currentDate = moment();
  const dateTimeInIST = moment(currentDate).toString();
 console.log("dateTimeInIST", dateTimeInIST);
    const formData = new FormData();
    formData.append("clockIn", dateTimeInIST);
    formData.append("date", dateTimeInIST );

    await clockIn(formData).then((res) => {
      if (res?.status === 200) {
        setToggleClockInOut(true);
      } else {
        toast.error("there is a error");
      }
    });
  };

  const onClockOutClick = async (e) => {
    e.preventDefault();

    const currentDate = moment();
    const dateTimeInIST = moment(currentDate).toString();
    console.log("dateTimeInIST", dateTimeInIST);
    const formData = new FormData();
    formData.append("date", dateTimeInIST);

    await clockOut(formData).then((res) => {
      if (res?.status === 200) {
        setToggleClockInOut(false);
      } else {
        toast.error("There is error");
      }
    });
  };

  const onPartialClick = () => {
    setIsOpen(true);
  };
  const getUserShift = async () => {
    const res = await getShift();
    if (res?.data?.user?.shift_id) {
      dispatch(storeShiftDetails(res?.data?.user?.shift_id));
      setShiftStartTime(getFormattedTime(res?.data?.user.shift_id?.startTime));
      setShiftEndTime(getFormattedTime(res?.data?.user.shift_id?.endTime));
      setShiftDuration(
        getCombinedDifference(
          res?.data?.user?.shift_id?.startTime,
          res?.data?.user?.shift_id?.endTime
        )
      );
    }
  };
  const getCurrentDateFormatted = () => {
    const currentDate = new Date();

    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    setPresentDate(formattedDate);
  };
  const arrangeWeeks = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
    const Labels = [
      ...dayLabels.slice(currentDay),
      ...dayLabels.slice(0, currentDay),
    ];
    setRearrangedDayLabels(Labels);
  };
  function convertHoursToHM(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  }
  const weeklyAttendance = async () => {
    const res = await getWeeklyAttendance();
    if (
      res.status === 200 &&
      res?.data?.user_arrival?.me?.onTimeArrival &&
      res?.data?.user_arrival?.myTeam?.onTimeArrival
    ) {
      setUserAvgHours(convertHoursToHM(res?.data?.user_arrival?.me?.avgHours));
      setTeamAvgHours(
        convertHoursToHM(res?.data?.user_arrival?.myTeam?.avgHours)
      );
      const roundedPercentage = parseFloat(
        res?.data?.user_arrival?.me?.onTimeArrival.toFixed(2)
      );
      const roundedTeam = parseFloat(
        res?.data?.user_arrival?.myTeam?.onTimeArrival.toFixed(2)
      );
      setUserArrival(roundedPercentage);
      setTeamArrival(roundedTeam);
    }
  };
  useEffect(() => {
    getUserShift();
    arrangeWeeks();
    getCurrentDateFormatted();
    weeklyAttendance();
  }, []);

  return (
    <div className="user-attendance-parent">
      <h2>Attendance</h2>
      <div className="user-attendance-card-contanier">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Attendance Stats" bordered={false}>
              <div className="attendance-stats-heading">
                <div className="attendance-stats-last-week-container">
                  <p>Last week</p>
                  <img id="down-arrow-icon" src={DownArrow} alt="NA" />
                </div>
                <img id="info-icon" src={InfoIcon} alt="NA" />
              </div>
              <div className="attendance-user-container">
                <div className="attendance-stats-left-container">
                  <div className="icon-container">
                    <img id="userIcon" src={UserIcon} alt="NA" />
                  </div>
                  <p>Me</p>
                </div>
                <div className="attendance-stats-right-container">
                  <div className="attendance-user-sub-container">
                    <p className="avg-hours">AVG HRS / DAY</p>
                    <p id="attendance-stats-time">{userAvgHours}</p>
                  </div>
                  <div className="attendance-user-sub-container">
                    <p className="avg-hours">ON TIME ARRIVAL</p>
                    <p id="attendance-stats-time">{userArrival}%</p>
                  </div>
                </div>
              </div>
              <hr />
              <div className="attendance-user-container">
                <div className="attendance-stats-left-container">
                  <div className="team-icon-container">
                    <img id="userIcon" src={TeamIcon} alt="NA" />
                  </div>
                  <p>Team</p>
                </div>
                <div className="attendance-stats-right-container">
                  <div className="attendance-user-sub-container">
                    <p className="avg-hours">AVG HRS / DAY</p>
                    <p id="attendance-stats-time">{teamAvgHours}</p>
                  </div>
                  <div className="attendance-user-sub-container">
                    <p className="avg-hours">ON TIME ARRIVAL</p>
                    <p id="attendance-stats-time">{TeamArrival}%</p>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Timings" bordered={false}>
              <div className="timing-heading-container">
                <div className="week-days-container">
                  {rearrangedDayLabels?.map((label, index) => (
                    <div
                      key={index}
                      className={
                        index === 0
                          ? "selected-day-icon-container"
                          : "not-selected-day-icon-container"
                      }
                    >
                      <span className="week-day-font">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="tracking-icons-container">
                  <img id="tracking-icons" src={TrackingIcon} alt="NA" />
                  <img id="tracking-icons" src={Fingerprint} alt="NA" />
                </div>
              </div>
              <div className="progress-bar-container">
                <Flex gap="small" vertical>
                  <p>
                    Today ({shiftStartTime} - {shiftEndTime})
                  </p>
                  <Progress
                    strokeColor={"#64c3d1"}
                    percent={100}
                    showInfo={false}
                  />
                  <div className="timing-footer-text-container">
                    <span>Duration:{shiftDuration}</span>
                    <span>Break: 0 Min</span>
                  </div>
                </Flex>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Actions" bordered={false}>
              <div className="week-days-container">
                <div className="timer-component-container">
                  <Timer />
                  <p>{presentDate}</p>
                  <br />
                  {toggleClockInOut && (
                    <div>
                      <div className="total-hours-container">
                        <span>TOTAL HOURS</span>
                        <img className="i-icon" src={InfoIcon} alt="NA" />
                      </div>
                      <p className="hours">Effective: {effectiveHours}</p>
                      <p className="hours">Gross: {grossHours}</p>
                    </div>
                  )}
                </div>
                <div className="clock-in-out-container">
                  {toggleClockInOut ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        onClick={(e) => onClockOutClick(e)}
                        className="primary-btn clockout-btn "
                      >
                        Web clock-out
                      </button>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ fontWeight: "500" }}>{lastLogin}</p>
                        <p
                          style={{
                            fontSize: "12px",
                            opacity: "0.5",
                            fontWeight: "400",
                          }}
                        >
                          {" "}
                          Since Last Login{" "}
                        </p>
                      </div>
                      <a onClick={(e) => onPartialClick(e)}>Partial Day</a>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <a onClick={(e) => onClockInClick(e)}>Web clock-in</a>
                      <a onClick={(e) => onPartialClick(e)}>Partial Day</a>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <ApplyPartialDay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        shiftStartTime={shiftStartTime}
        shiftEndTime={shiftEndTime}
      />
      <section>
        <UserAttendenceLogs
          isUser={true}
          setEffectiveHours={(hours) => setEffectiveHours(hours)}
          setGrossHours={(hours) => setGrossHours(hours)}
          toggleClockInOut={toggleClockInOut}
          setToggleClockInOut={setToggleClockInOut}
          setLastLogin={setLastLogin}
          upDateLogs={upDateLogs}
          setUpDateLogs={() => setUpDateLogs(true)}
        />
      </section>
    </div>
  );
};
export default Attendence;
