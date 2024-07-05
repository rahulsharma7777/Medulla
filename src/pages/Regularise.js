import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Norequest } from "../Assests/Constants";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";

import {
  getRegularization,
  acceptRegularisation,
  updateInbox,
  getNotifications,
} from "../services/Index";
import RenderClockInAndOut from "../components/RenderRegulariseLogs";
import {
  updateNotications,
  updateCountOfNotications,
  updateRegCount,
} from "../redux/slice/notificationsSlice.js";
import moment from "moment";

const Regularization = () => {
  const [generalList, setGeneralList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fadeIn, setFadeOut] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  async function fetchLeaves() {
    try {
      dispatch(showLoader());
      const response = await getRegularization();
      const revereseData = response.data.reverse();
      setGeneralList(revereseData);
      setSelectedCard(revereseData[0]);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
  const refreshInbox = async () => {
    const data = {
      notification_type: 3,
      seen: true,
    };
    try {
      const res = await updateInbox(data);
      if (res.status === 200) {
        const response = await getNotifications();
        if (response.data.length) {
          dispatch(updateNotications(true));
          dispatch(updateCountOfNotications(response.data.length));
          dispatch(updateRegCount(""));
        } else {
          dispatch(updateNotications(false));
          dispatch(updateRegCount(""));
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchLeaves();
    refreshInbox();
  }, []);
  const handleCardClick = (cardData) => {
    setFadeOut(true);
    setSelectedCard(cardData);
    setTimeout(() => {
      setFadeOut(false);
    }, 500);
  };
  const handleaccept = async (status, selectedCard) => {
    if (!comment) {
      return toast.warning(" Please write note ", {
        autoClose: 2000,
      });
    }

    try {
      dispatch(showLoader());
      const data = {
        status: status,
        regularize_id: selectedCard.regularize_id._id,
        reason: comment,
      };
      const res = await acceptRegularisation(data);
      if (res.status === 200) {
        setComment("");
        fetchLeaves();
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };
  if (generalList.length === 0 && !selectedCard) {
    return (
      <div className="alternate-content">
        <h1>No Pending Requests</h1>
        <div className="image-section">
          <img src={Norequest} alt="No request"></img>
        </div>
      </div>
    );
  }
  const formattedDate = (data) => {
    const formattedDates = moment(data).format("DD/MM/YYYY HH:mm:ss");
    return formattedDates;
  };
  function calculateTimeDifference(appliedDate) {
    const currentIST = new Date();
    const timeDifference =
      currentIST.getTime() - new Date(appliedDate).getTime();

    if (timeDifference > 24 * 60 * 60 * 1000) {
      const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      return `${days} days ago`;
    } else {
      const hours = Math.floor(timeDifference / (60 * 60 * 1000));
      return `${hours} hours ago`;
    }
  }
  return (
    <div className="action-container">
      <div className="action-content">
        <div className="heading">
          <h3>Attendance Regularization</h3>
        </div>
        <div className="leave-card-outer">
          {generalList?.map((leave) => (
            <div
              className={`leave-card cursor-pointers ${
                selectedCard === leave ? "active " : ""
              }`}
              key={leave._id}
              onClick={() => handleCardClick(leave)}
            >
              <div className="emp-image">
                <div>
                  <img
                    src={leave?.sender_id?.profile_img}
                    alt="logo"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                </div>

                <div>
                  <h4>{leave?.sender_id?.user_name}</h4>
                  <h5>
                    Attendance Regularization <br></br>
                    {new Date(leave?.regularize_id?.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}{" "}
                  </h5>
                  <p className="comment"> {leave?.regularize_id?.note}</p>
                </div>
              </div>
              <p className="ago">
                {calculateTimeDifference(
                  new Date(leave?.regularize_id?.createdAt)
                )}
              </p>
            </div>
          ))}{" "}
        </div>
      </div>
      {selectedCard && (
        <div className={`manage-actions ${fadeIn ? "fadeinout" : ""}`}>
          <div className="upper-part ">
            <div className="user-details">
              <div className="image">
                <img
                  className="card-image"
                  src={selectedCard?.sender_id?.profile_img}
                  alt="logo"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
              </div>
              <div>
                <h3>{selectedCard?.sender_id?.user_name}</h3>

                <p>
                  Requested by {selectedCard?.sender_id?.user_name} on{" "}
                  {formattedDate(selectedCard?.regularize_id?.createdAt)}
                </p>
              </div>
            </div>
            <div className="action-date-flex">
              <div className="action-date">
                <div className="month">
                  <p>
                    {new Date(selectedCard?.regularize_id?.date).toLocaleString(
                      "en-US",
                      { month: "long" }
                    )}
                  </p>
                </div>
                <h2 style={{ margin: "0px 5px 5px 5px" }}>
                  {new Date(selectedCard?.regularize_id?.date).getDate()}
                </h2>
                <p style={{ margin: "5px" }}>
                  {new Date(selectedCard?.regularize_id?.date).toLocaleString(
                    "en-US",
                    { weekday: "long" }
                  )}
                </p>
              </div>
              <div className="action-leave">
                <h3>
                  <h3>Attendance Regularization Request</h3>
                </h3>
              </div>
            </div>

            <div className="timing-details">
              <div className="timing-heading">
                <h3 style={{ borderRight: "1px solid rgb(227, 221, 221)" }}>
                  Punch Type
                </h3>
                <h3>Time Entry</h3>
              </div>

              <RenderClockInAndOut clock={selectedCard?.attendanceLog?.clock} />
            </div>
          </div>
          <div className="bottom-content">
            <input
              type="text"
              value={comment}
              id="comment"
              name="comment"
              className="comment-section"
              placeholder="Enter your comment..."
              onChange={(e) => setComment(e.target.value)}
              autocomplete="off"
            ></input>

            <div className="button-containers">
              <button
                className="primary-btn accept-btn"
                style={{ backgroundColor: "#0c801b" }}
                onClick={() => handleaccept(1, selectedCard)}
              >
                Accept
              </button>
              <button
                className="primary-btn reject-btn"
                style={{ backgroundColor: "rgb(228, 7, 7)" }}
                onClick={() => handleaccept(2, selectedCard)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Regularization;
