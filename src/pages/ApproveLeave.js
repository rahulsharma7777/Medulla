import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  updateNotications,
  updateCountOfNotications,
  updateLeavesCount,
} from "../redux/slice/notificationsSlice.js";
import { Norequest } from "../Assests/Constants";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import {
  acceptleaves,
  updateInbox,
  getNotifications,
  getGeneralLeaves,
  peersOnLeave,
} from "../services/Index";
const InboxActionLeaves = () => {
  const [generalList, setGeneralList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fadeIn, setFadeOut] = useState(false);
  const [comment, setComment] = useState(null);
  const dispatch = useDispatch();
  async function fetchLeaves() {
    try {
      dispatch(showLoader());
      const response = await getGeneralLeaves();
      const revereseData = response.data.reverse();
      setGeneralList(revereseData);
      setSelectedCard(revereseData[0]);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
  const getPeerDetails = () => {
    const res = peersOnLeave();
  };

  const refreshInbox = async () => {
    const data = {
      notification_type: 1,
      seen: true,
    };
    try {
      const res = await updateInbox(data);
      if (res.status === 200) {
        const response = await getNotifications();
        if (response.data.length) {
          dispatch(updateNotications(true));
          dispatch(updateCountOfNotications(response.data.length));

          dispatch(updateLeavesCount(""));
        } else {
          dispatch(updateNotications(false));
          dispatch(updateLeavesCount(""));
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchLeaves();
    // getPeerDetails();
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
        autoClose: 500,
      });
    } else if (status === 1) {
      try {
        dispatch(showLoader());
        const data = { status: status, leave_id: selectedCard.leave_id._id };
        const res = await acceptleaves(data);
        if (res.status === 200) {
          toast.success("Action Successfull");

          fetchLeaves();
        }
      } catch (error) {
        toast.error(" there is a problem");
      } finally {
        dispatch(hideLoader());
      }
    } else {
      try {
        dispatch(showLoader());
        const data = {
          status: status,
          leave_id: selectedCard.leave_id._id,
          reason: comment,
        };
        const res = await acceptleaves(data);

        if (res.status === 200) {
          toast.success("Action Successfull", {
            autoClose: 2000,
          });

          fetchLeaves();
        }
      } catch (error) {
        toast.error(" there is a problem", {
          autoClose: 2000,
        });
      } finally {
        dispatch(hideLoader());
      }
      setComment("");
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
          <h3> Leave Requests</h3>
        </div>
        <div className="leave-card-outer">
          {generalList?.map((leave) => (
            <div
              className={`leave-card cursor-pointers ${
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
                    Leave on{" "}
                    {new Date(leave.leave_id.from_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}{" "}
                    ({leave.leave_id.leave_days}{" "}
                    {leave.leave_id.leave_days > 1 ? "days" : "day"})
                  </h5>
                  <p className="comment"> {leave.leave_id.note}</p>
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
                    {new Date(selectedCard?.leave_id?.from_date).toLocaleString(
                      "en-US",
                      { month: "long" }
                    )}
                  </p>
                </div>
                <h2 style={{ margin: "0px 5px 5px 5px" }}>
                  {new Date(selectedCard?.leave_id?.from_date).getDate()}
                </h2>
                <p style={{ margin: "5px" }}>
                  {new Date(selectedCard?.leave_id?.from_date).toLocaleString(
                    "en-US",
                    { weekday: "long" }
                  )}
                </p>
              </div>
              <div className="action-leave">
                <h3>
                  <h3>
                    {`${selectedCard?.leave_id?.leave_days} ${
                      selectedCard?.leave_id?.leave_days > 1 ? "days" : "day"
                    } of unpaid leave`}
                  </h3>
                </h3>
                <p>
                  Leave ends on{" "}
                  {new Date(
                    selectedCard?.leave_id?.to_date
                  ).toLocaleDateString()}
                </p>
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

export default InboxActionLeaves;
