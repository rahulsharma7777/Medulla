import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Col, Input, Row, Pagination } from "antd";
import { Link } from "react-router-dom";
import { FcLeave } from "react-icons/fc";
import { Tooltip } from "antd";
import { toast } from "react-toastify";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import LeaveHistoryShimmer from "../components/LeaveHistoryShimmer";
import { leavesHistory, cancleLeave, reapplyLeave } from "../services/Index";
const LeavesHistory = ({
  setOpenLeaveModal,
  openLeaveModal,
  reload,
  setUpdateLeaves,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [leavsHistoryDetails, setLeavsHistoryDetails] = useState([]);
  const [filteredLeaveHistory, setFilteredLeaveHistory] = useState([]);
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const onLeavechangeHandler = (value) => {
    setSelectedLeaveTypes(value);
  };
  const Leave_Type = [
    { name: "Comp Off", code: "0" },
    { name: "General Leave", code: "1" },
    { name: "Unpaid Leave ", code: "2" },
  ];
  const Status = [
    { name: "Approved", code: "1" },
    { name: "Rejected", code: "2" },
    { name: "Cancel", code: "3" },
    { name: "Pending", code: "0" },
  ];
  const onStatuschangeHandler = (value) => {
    setSelectedStatuses(value);
  };
  const getLeaveName = (statusCode) => {
    switch (statusCode) {
      case 1:
        return "General Leave";
      case 2:
        return "Unpaid Leave";
      case 0:
        return "Comp Off";
      default:
        return "Unknown";
    }
  };
  const getStatusName = (statusCode) => {
    switch (statusCode) {
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      case 3:
        return "Cancel";
      case 0:
        return "Pending";
      default:
        return "Unknown";
    }
  };
  async function getLeavesHistory() {
    try {
      setIsLoading(true);
      const res = await leavesHistory();
      const rev = res?.data?.user_leave.reverse();
      setLeavsHistoryDetails(rev);
      setFilteredLeaveHistory(rev);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  const resetPagination = () => {
    setCurrentPage(1);
  };
  const handleFilterChange = () => {
    resetPagination();
  };

  useEffect(() => {
    getLeavesHistory();
  }, [reload]);

  useEffect(() => {
    if (selectedLeaveTypes || selectedStatuses) {
      filterLeaveHistory();
      handleFilterChange();
    }
  }, [selectedLeaveTypes, selectedStatuses]);
  const filterLeaveHistory = () => {
    const leaveTypeCodes = selectedLeaveTypes.map(
      (selectedType) => selectedType.code
    );
    const statusCodes = selectedStatuses.map(
      (selectedStatus) => selectedStatus.code
    );
    if (leaveTypeCodes.length === 0 && statusCodes.length === 0) {
      setFilteredLeaveHistory(leavsHistoryDetails);
      return;
    }
    let filteredHistory = leavsHistoryDetails;
    if (leaveTypeCodes.length !== 0) {
      filteredHistory = filteredHistory?.filter((record) =>
        leaveTypeCodes.includes(record.leave_type.toString())
      );
    }

    if (statusCodes.length !== 0) {
      filteredHistory = filteredHistory?.filter((record) =>
        statusCodes.includes(record.status.toString())
      );
    }
    setFilteredLeaveHistory(filteredHistory);
  };
  const handleLeaveModal = () => {
    setOpenLeaveModal(!openLeaveModal);
  };
  const handleReapply = async (log) => {
    try {
      const res = await reapplyLeave(log?._id);
      if (res.status === 200) {
        getLeavesHistory();
        setUpdateLeaves();
      }
    } catch (error) {}
  };
  const handleCancle = async (data) => {
    const values = {
      status: 3,
      leave_id: data?._id,
    };
    try {
      const res = await cancleLeave(values);
      if (res.status === 200) {
        toast.success("Action Successfully");
        getLeavesHistory();
        setUpdateLeaves();
      } else {
        toast.error("there is a error");
      }
    } catch (error) {}
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > totalPages) {
      setCurrentPage(totalPages);
    }
  };
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(
    startIndex + pageSize,
    filteredLeaveHistory?.length
  );
  const totalPages = Math.ceil(filteredLeaveHistory?.length / pageSize);

  return (
    <div>
      <div className="leave-heading">
        <h2>Leaves History</h2>
      </div>
      <div className="leave-heading-top">
        <div
          className="types-dropdown"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MultiSelect
            className="w-full md:w-20rem"
            value={selectedLeaveTypes}
            onChange={(e) => onLeavechangeHandler(e.value)}
            options={Leave_Type}
            optionLabel="name"
            placeholder="Leave Type"
            maxSelectedLabels={0}
            style={{ width: "100%", maxWidth: "20rem", padding: "13px" }}
          />
        </div>

        <div
          className="status-dropdown"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <MultiSelect
            value={selectedStatuses}
            onChange={(e) => onStatuschangeHandler(e.value)}
            options={Status}
            optionLabel="name"
            placeholder="Status"
            style={{ width: "100%", maxWidth: "20rem", padding: "13px" }}
          />
        </div>
        <div className="leaves-search-bar"></div>
      </div>
      <Row gutter={[16, 16]} className="leave-row">
        <Col sm={6} md={12} lg={19} className="leave-left">
          {isLoading ? (
            <LeaveHistoryShimmer />
          ) : filteredLeaveHistory && filteredLeaveHistory.length > 0 ? (
            filteredLeaveHistory
              .slice(startIndex, endIndex)
              .map((leave, index) => (
                <Row key={index} gutter={[16, 16]} className="leave-left-row">
                  <Col lg={6} className="leave-col">
                    <div className="past-leave">
                      <span className="image">
                        <div className="circle">
                          <FcLeave />
                        </div>
                      </span>
                      <div className="data">
                        <p className="text">past leave</p>
                        <h5 className="date">
                          {new Date(leave?.from_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                          ({leave?.leave_days}{" "}
                          {leave?.leave_days > 1 ? "days" : "day"})
                        </h5>
                        <h6 className="note">
                          <strong>Leave Note: </strong> {leave.note}
                        </h6>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className="leave-col">
                    <p className="text">leave type</p>
                    <h5 className="date">{getLeaveName(leave?.leave_type)}</h5>
                  </Col>
                  <Col lg={6} className="leave-col">
                    <p className="text">requested on</p>
                    <h5 className="date">
                      {new Date(leave?.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h5>
                  </Col>
                  <Col
                    lg={6}
                    className="leave-col"
                    style={{
                      width: "9%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p className="text">status</p>
                      <h5 className="date">{getStatusName(leave?.status)}</h5>

                      {leave.status === 1 || leave.status === 2 ? (
                        <Tooltip
                          overlayStyle={{
                            height: "50px ",
                            width: "150px",
                          }}
                          overlayInnerStyle={{
                            backgroundColor: "white",
                          }}
                          title={
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-start",
                              }}
                            >
                              {leave.status === 1 && (
                                <span style={{ color: "#7e7c7c" }}>
                                  Approved by
                                </span>
                              )}{" "}
                              {leave.status === 2 && (
                                <span style={{ color: "#7e7c7c" }}>
                                  Rejected by
                                </span>
                              )}
                              <span style={{ color: "#252525" }}>
                                {leave?.actionBy?.user_name}
                              </span>
                            </div>
                          }
                          trigger="click"
                          placement="right"
                        >
                          <span className="text2">View</span>
                        </Tooltip>
                      ) : null}
                    </div>
                    {(leave.status === 0 || leave.status === 3) && (
                      <div>
                        {" "}
                        <Tooltip
                          overlayStyle={{
                            width: "100px",
                            height: "40px ",
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
                                color: "black",
                              }}
                            >
                              {leave.status === 3 && (
                                <div
                                  className="text2"
                                  style={{ marginTop: "5px" }}
                                  onClick={() => handleReapply(leave)}
                                >
                                  {" "}
                                  Re Apply
                                </div>
                              )}
                              {leave.status === 0 && (
                                <div
                                  className="text2"
                                  style={{ marginTop: "5px" }}
                                  onClick={() => handleCancle(leave)}
                                >
                                  Cancel
                                </div>
                              )}
                            </div>
                          }
                          trigger={["click"]}
                          arrow={false}
                          placement="left"
                        >
                          <div
                            className="dot-icon-container"
                            style={{ display: "inline-block" }}
                          >
                            <PiDotsThreeOutlineFill
                              className="dot-icon"
                              style={{ color: "black" }}
                              onMouseOver={(e) =>
                                (e.target.style.color = "rgb(84, 187, 221)")
                              }
                              onMouseOut={(e) =>
                                (e.target.style.color = "black")
                              }
                            />
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  </Col>
                </Row>
              ))
          ) : (
            <h1 className="alternate-text">No History To Show </h1>
          )}
        </Col>
        <Col sm={6} md={12} lg={5}>
          <div className="leave-col2">
            <div className="req-leave">
              <button className="primary-btn" onClick={handleLeaveModal}>
                Request Leave
              </button>
              <br />
              <Link to="">Request Credit for Compensatory Off</Link>
              <Link to="">Leave Policy Explanation</Link>
            </div>
          </div>
        </Col>
      </Row>
      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={filteredLeaveHistory?.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          style={{ marginTop: "16px", textAlign: "center" }}
        />
      )}
    </div>
  );
};
export default LeavesHistory;
