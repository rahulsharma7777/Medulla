import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPartialLeaves } from "../services/Index";
import {
  addMinutesToIST,
  subtractMinutesFromIST,
} from "../components/common/Timerfunctions.js";
import {
  acceptPartialDay,
  updateInbox,
  getNotifications,
} from "../services/Index";
import {
  updateNotications,
  updateCountOfNotications,
  updatePartialCount,
} from "../redux/slice/notificationsSlice.js";
import { toast } from "react-toastify";
import { Norequest } from "../Assests/Constants";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";

const InboxActionPartialDay = () => {
  const [generalList, setGeneralList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fadeIn, setFadeOut] = useState(false);
  const [comment, setComment] = useState(null);
  const dispatch = useDispatch();
  async function fetchLeaves() {
    try {
      dispatch(showLoader());
      const response = await getPartialLeaves();
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
      notification_type: 2,
      seen: true,
    };
    try {
      const res = await updateInbox(data);
      if (res.status === 200) {
        const response = await getNotifications();

        if (res.data.length) {
          dispatch(updateNotications(true));
          dispatch(updateCountOfNotications(response.data.length));

          dispatch(updatePartialCount(""));
        } else {
          dispatch(updateNotications(false));
          dispatch(updatePartialCount(""));
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
  const handleLeave = async (status, selectedCard) => {
    if (status === 2 && !comment) {
      return toast.warning("please write the reason", {
        autoClose: 2000,
      });
    } else if (status === 1) {
      try {
        dispatch(showLoader());
        const data = {
          status: status,
          partial_id: selectedCard.partialDay_id._id,
        };
        const res = await acceptPartialDay(data);
        if (res.status === 200) {
          setComment("");
          fetchLeaves();
          toast.success("Operation Successful", {
            autoClose: 2000,
          });
        }
      } catch (error) {
        toast.error(" there is a problem", {
          autoClose: 2000,
        });
      } finally {
        dispatch(hideLoader());
      }
    } else {
      try {
        dispatch(showLoader());
        const data = {
          status: status,
          partial_id: selectedCard.partialDay_id._id,
          reason: comment,
        };
        const res = await acceptPartialDay(data);
        if (res.status === 200) {
          toast.success("Operation Successful", {
            autoClose: 2000,
          });
          setComment("");
          fetchLeaves();
        }
      } catch (error) {
        toast.error(" there is a problem", {
          autoClose: 2000,
        });
      } finally {
        dispatch(hideLoader());
      }
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
  return (
    <div className="action-container">
      <div className="action-content">
        <div className="heading">
          <h3> Partial Day</h3>
        </div>
        <div className="leave-card-outer">
          {generalList?.map((leave) => (
            <div
              className={`leave-card  cursor-pointers ${
                selectedCard === leave ? "active" : ""
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
                    Partial Day{" "}
                    {new Date(leave?.partialDay_id?.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}{" "}
                  </h5>
                  <p className="comment"> {leave.partialDay_id.reason}</p>
                </div>
              </div>
              <p className="ago">
                {new Date().getTime() - new Date(leave.createdAt).getTime() >
                24 * 60 * 60 * 1000
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(leave.createdAt).getTime()) /
                        (24 * 60 * 60 * 1000)
                    ) + " days ago"
                  : Math.floor(
                      (new Date().getTime() -
                        new Date(leave.createdAt).getTime()) /
                        (60 * 60 * 1000)
                    ) + " hours ago"}
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedCard && (
        <div className={`manage-actions ${fadeIn ? "fadeinout" : ""}`}>
          <div className="upper-part">
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
                  {new Date(selectedCard?.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="action-date-flex">
              <div className="action-date">
                <div className="month">
                  <p>
                    {new Date(
                      selectedCard?.partialDay_id?.applied_date
                    ).toLocaleString("en-US", { month: "long" })}
                  </p>
                </div>
                <h2 style={{ margin: "0px 5px 5px 5px" }}>
                  {new Date(
                    selectedCard?.partialDay_id?.applied_date
                  ).getDate()}
                </h2>
                <p style={{ margin: "5px" }}>
                  {new Date(
                    selectedCard?.partialDay_id?.applied_date
                  ).toLocaleString("en-US", { weekday: "long" })}
                </p>
              </div>
              <div className="action-leave">
                <h3>
                  {selectedCard?.partialDay_id?.type === 1 && (
                    <>
                      Partial Day leaving early by{" "}
                      {selectedCard?.partialDay_id?.minutes} minutes
                    </>
                  )}

                  {selectedCard?.partialDay_id?.type === 2 && (
                    <>
                      Partial Day will leave at{" "}
                      {new Date(
                        selectedCard?.partialDay_id?.time
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}{" "}
                      for a duration of {selectedCard?.partialDay_id?.minutes}{" "}
                      minutes
                    </>
                  )}
                  {selectedCard?.partialDay_id?.type === 3 && (
                    <>
                      Partial Day coming late by{" "}
                      {selectedCard?.partialDay_id?.minutes} minutes
                    </>
                  )}
                </h3>
                <h3
                  style={{
                    opacity: "0.5",
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  {" "}
                  {selectedCard?.partialDay_id?.type === 1 && (
                    <>
                      Will Leave At{" "}
                      {subtractMinutesFromIST(
                        selectedCard?.partialDay_id?.time,
                        selectedCard?.partialDay_id?.minutes
                      )}
                    </>
                  )}
                  {selectedCard?.partialDay_id?.type === 3 && (
                    <>
                      Will Come at{" "}
                      {addMinutesToIST(
                        selectedCard?.partialDay_id?.time,
                        selectedCard?.partialDay_id?.minutes
                      )}
                    </>
                  )}
                </h3>
              </div>
            </div>

            {/* <div className="peer-details" style={{}}>
              <h3>Teammates on leave today</h3>
              <div
                className="team-details"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                <img
                  style={{ width: "50px", borderRadius: "50%" }}
                  className="card-image"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt="logo"
                />
                <h2 style={{ fontSize: "16px", fontWeight: "500" }}>
                  Hitesh mann
                </h2>
              </div>
            </div> */}
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
            ></input>

            <div className="button-containers">
              <button
                className="primary-btn accept-btn"
                style={{ backgroundColor: "#0c801b" }}
                onClick={() => {
                  handleLeave(1, selectedCard);
                }}
              >
                Accept
              </button>
              <button
                className="primary-btn reject-btn"
                style={{ backgroundColor: "rgb(228, 7, 7)" }}
                onClick={() => {
                  handleLeave(2, selectedCard);
                }}
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

export default InboxActionPartialDay;
