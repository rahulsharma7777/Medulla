import React, { useEffect, useState } from "react";
import { Col, Input, Row } from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { IoChevronDownSharp } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LeavesHistory from "../components/LeavesHistory";
import { PieChart } from "react-minimal-pie-chart";
import { Select, Space, Spin } from "antd";
import { BsInfinity } from "react-icons/bs";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import {
  getOrgUsers,
  getManager,
  applyLeaves,
  getAvailableLeaves,
  getConsumedLeavesData,
} from "../services/Index";

const Leaves = () => {
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [leaveDropdown, setLeaveDropdown] = useState(false);
  const [fromActive, setFromActive] = useState(false);
  const [toActive, setToActive] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [leavesData, setLeavesData] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const [isFromDatePickerVisible, setIsFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setIsToDatePickerVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [fromPlaceholder, setFromPlaceholder] = useState(false);
  const [toPlaceholder, setToPlaceholder] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLeave, setSelectedLeave] = useState("Select");
  const [manager, setManager] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [typeofDay, setTypeofDay] = useState(0);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lengthofText, setLengthOfText] = useState(0);
  const [reload, setReload] = useState(false);
  const [updateLeaves, setUpdateLeaves] = useState(false);
  const [note, setNote] = useState(null);
  const [consumedData, setConsumedData] = useState("");
  const dispatch = useDispatch();
  let percentageofConsumed, percentageofAvailable;
  const total =
    consumedData?.available?.generalLeaveCount +
    consumedData?.consumed?.generalLeaveCount;
  if (total) {
    percentageofConsumed =
      (consumedData?.consumed?.generalLeaveCount / total) * 100;

    percentageofAvailable =
      (consumedData?.available?.generalLeaveCount / total) * 100;
  }

  const radius = 42;
  const lineWidth = 30;
  const center = {
    x: radius + lineWidth / 4,
    y: (radius + lineWidth) / 2,
  };
  const textX = center.x;
  const textY = center.y;
  const handleLeaveModal = () => {
    setOpenLeaveModal(!openLeaveModal);
  };

  const handleCancel = () => {
    setOpenLeaveModal(false);
    setSelectedUsers([]);
    setNote("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedLeave("Select");
    setNumberOfDays(0);
    setToPlaceholder(false);
    setFromPlaceholder(false);
    setIsActive(false);
    setOptions(false);
  };

  const handleLeaveDropdown = () => {
    setLeaveDropdown(!leaveDropdown);
    setIsFromDatePickerOpen(false);
    setIsToDatePickerOpen(false);
    setIsFromDatePickerVisible(false);
    setIsToDatePickerVisible(false);
  };

  const handleFrom = () => {
    if (leaveDropdown) {
      setLeaveDropdown(!leaveDropdown);
    }
    setFromActive(true);
    setToActive(false);
    setIsToDatePickerOpen(false);
    setIsFromDatePickerOpen(!isFromDatePickerOpen);
    setIsToDatePickerVisible(false);
    setIsFromDatePickerVisible(!isFromDatePickerVisible);
  };
  const handleStartDateChange = (date) => {
    console.log("date", date);
    console.log("!toPlaceholder", toPlaceholder);
    if (toPlaceholder && date > endDate) {
      toast.warning("From date Should be less than To date!!", {
        autoClose: 3000,
      });
    }

    setStartDate(date);
    setFromPlaceholder(true);
  };
  const calDiffrence = (date1, date2) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    diffDays++;
    setNumberOfDays(diffDays);
  };

  useEffect(() => {
    const trimmedSearchText = searchText.trim();
    const words = trimmedSearchText.split(/\s+/);
    const lastWord = words.pop();
    const trimmedInput = lastWord.trim();
    const lengthOfLastWord = trimmedInput.length;
    setLengthOfText(lengthOfLastWord);
    if (lengthOfLastWord >= 3) {
      fetchData(trimmedInput);
    } else {
      setOptions([]);
    }
  }, [searchText]);
  async function getLeaves() {
    const res = await getAvailableLeaves();
    setLeavesData(res?.data?.available_leaves);
  }
  async function getDetailsofManager() {
    const res = await getManager();
    if (res.status === 200) {
      setManager(res?.data[0]?.manager_details?._id);
    }
  }
  const getConsumedData = async () => {
    const res = await getConsumedLeavesData();

    setConsumedData(res?.data?.data);
  };
  useEffect(() => {
    getConsumedData();
    getLeaves();
  }, [updateLeaves]);

  useEffect(() => {
    getDetailsofManager();
  }, []);

  const handleEndDateChange = (date) => {
    setToPlaceholder(true);
    setEndDate(date);
  };

  const handleTo = () => {
    if (leaveDropdown) {
      setLeaveDropdown(!leaveDropdown);
    }
    setFromActive(false);
    setToActive(true);
    setIsFromDatePickerOpen(false);
    setIsToDatePickerOpen(!isToDatePickerOpen);
    setIsFromDatePickerVisible(false);
    setIsToDatePickerVisible(!isToDatePickerVisible);
  };
  const handelFocus = () => {
    setIsFromDatePickerOpen(false);
    setIsToDatePickerOpen(false);
    setIsFromDatePickerVisible(false);
    setIsToDatePickerVisible(false);
  };

  const fetchData = async (trimmedInput) => {
    try {
      setLoading(true);
      const response = await getOrgUsers(trimmedInput);
      if (response.status === 400) {
        setOptions([]);
      }

      if (response.status === 200) {
        const dropdownOptions = response?.data?.map((ele) => {
          return {
            value: ele._id,
            label: ele.user_name,
          };
        });

        const filteredOptions = dropdownOptions.filter(
          (option) => !selectedUsers.includes(option.value)
        );

        setOptions(filteredOptions);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleDays = (day) => {
    setTypeofDay(day);

    setIsActive(!isActive);
    if (day === 1) {
      setNumberOfDays(0.5);
    }
    if (day === 0) {
      setNumberOfDays(1);
    }
  };

  const handleSearch = async (value) => {
    setSearchText(value);
  };
  const handleChange = (selectedValues) => {
    const uniqueSelectedValues = [...new Set(selectedValues)];
    setSelectedUsers(uniqueSelectedValues);
  };
  const handleLeaveTypeSelection = (leaveType) => {
    setLeaveDropdown(false);
    if (leaveType === 2) {
      setSelectedLeave("unpaid leave");
    } else if (leaveType === 0) {
      return toast.error("Not Available");
    } else {
      if (leaveType === 1) {
        if (leavesData === 0) {
          return toast.error("Leaves Balance is empty");
        } else if (leavesData !== 0.5 && leavesData < numberOfDays) {
          toast.error("Not Enough Leaves");
        }
      }
      setSelectedLeave("General leave");
    }
  };
  const handleApply = async () => {
    if (!startDate) {
      return toast.info("Select  from date");
    }
    if (!endDate) {
      return toast.info("Select to date");
    }
    if (startDate > endDate) {
      return toast.error("Starting date should be less than ending date", {
        autoClose: 3000,
      });
    }
    if (selectedLeave === "Select") {
      return toast.info("Select the type of leave", {
        autoClose: 2000,
      });
    }
    if (selectedLeave === "General leave" && leavesData < numberOfDays) {
      return toast.error("Not Enough Leaves");
    }

    if (note === null) {
      return toast.info("please write note ", {
        autoClose: 2000,
      });
    }
    if (!manager) {
      return toast.error("Invalid Team of User");
    }

    let formattedUsers = selectedUsers;
    if (manager) {
      formattedUsers = selectedUsers.includes(manager)
        ? selectedUsers
        : [...selectedUsers, manager];
    }
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const startDay = String(startDate.getDate()).padStart(2, "0");
    const formattedStartDate = `${startYear}-${startMonth}-${startDay}T00:00:00.000+00:00`;
    const endYear = startDate.getFullYear();
    const endMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const endDay = String(startDate.getDate()).padStart(2, "0");
    const formattedEndDate = `${endYear}-${endMonth}-${endDay}T00:00:00.000+00:00`;
    let formattedLeave;
    if (selectedLeave === "General leave") {
      formattedLeave = 1;
    } else if (selectedLeave === "unpaid leave") {
      formattedLeave = 2;
    } else {
      return toast.error(" you do no have Compensatory Offs", {
        autoClose: 2000,
      });
    }

    const data = {
      leave_type: formattedLeave,
      date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00",
      sub_leaveType: typeofDay,

      from_date: formattedStartDate,
      to_date: formattedEndDate,
      note: note,
      receiver_ids: formattedUsers,
      leave_days: numberOfDays,
    };
    try {
      dispatch(showLoader());
      const res = await applyLeaves(data);
      if (res.status === 200) {
        toast.success("woah! Applied Successfully");
        setUpdateLeaves((prev) => !prev);
        setToPlaceholder(false);
        setFromPlaceholder(false);
        setOpenLeaveModal(false);
        setSelectedUsers([]);
        setNote("");
        setIsActive(false);
        setStartDate(new Date());
        setEndDate(new Date());
        setSelectedLeave("Select");
        setNumberOfDays(0);
        setOptions(false);
        setReload(!reload);
      } else {
        toast.error(res?.error_message, {
          autoClose: 3000,
        });
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (fromPlaceholder && toPlaceholder) {
      calDiffrence(startDate, endDate);
    }
  }, [fromPlaceholder, toPlaceholder, startDate, endDate]);

  return (
    <div className="leaves-main">
      <LeavesHistory
        setOpenLeaveModal={setOpenLeaveModal}
        openLeaveModal={openLeaveModal}
        reload={reload}
        setUpdateLeaves={() => setUpdateLeaves((prev) => !prev)}
      />
      {openLeaveModal && (
        <div className="leave-modal">
          <div className="leave-modal-content">
            <div className="leave-header">
              <h4>Request Leave</h4>
              <RxCross2
                onClick={handleLeaveModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <h3 className="leave-type">
              Select type of leave you want to apply
            </h3>
            <div className="date-selection">
              <div
                className={`from-date ${
                  fromActive && isFromDatePickerOpen ? "activate" : ""
                }`}
                onClick={handleFrom}
              >
                <p style={{ fontSize: "15px" }}>From </p>
                <div className="from-modal">
                  <DatePicker
                    placeholderText={!fromPlaceholder ? "Select date" : ""}
                    open={isFromDatePickerOpen}
                    onCalendarClose={() => {
                      if (!isFromDatePickerOpen) {
                        setFromActive(false);
                      }
                    }}
                    selected={fromPlaceholder ? startDate : ""}
                    onClickOutside={() => {
                      setIsFromDatePickerOpen(false);
                    }}
                    onChange={handleStartDateChange}
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                    }) => (
                      <div
                        className="date-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="increment-btn">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              decreaseMonth();
                            }}
                          >
                            <IoChevronBackOutline />
                          </button>
                        </div>
                        <div className="date">
                          <span style={{ fontSize: "15px" }}>
                            {date.toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="increment">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              increaseMonth();
                            }}
                          >
                            <MdArrowForwardIos />
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="days">
                <p>{numberOfDays} days</p>
              </div>
              <div
                className={`to-date ${
                  toActive && isToDatePickerOpen ? "activate" : ""
                }`}
                onClick={handleTo}
              >
                <div className="date-conten">
                  <p style={{ fontSize: "15px" }}>To </p>
                  <div className="to-modal">
                    <DatePicker
                      placeholderText={!toPlaceholder ? "Select date" : ""}
                      open={isToDatePickerOpen}
                      onCalendarClose={() => {
                        if (!isToDatePickerOpen) {
                          setToActive(false);
                        }
                      }}
                      selected={toPlaceholder ? endDate : ""}
                      onChange={handleEndDateChange}
                      minDate={startDate}
                      onClickOutside={() => {
                        setIsToDatePickerOpen(false);
                        setToActive(false);
                      }}
                      renderCustomHeader={({
                        date,
                        decreaseMonth,
                        increaseMonth,
                      }) => (
                        <div
                          className="date-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div className="increment-btn">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                decreaseMonth();
                              }}
                            >
                              <IoChevronBackOutline />
                            </button>
                          </div>
                          <div className="date">
                            <span style={{ fontSize: "15px" }}>
                              {date.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="increment">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                increaseMonth();
                              }}
                            >
                              <MdArrowForwardIos />
                            </button>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="leave-dropdown">
              <div className="header" onClick={handleLeaveDropdown}>
                <p>{selectedLeave}</p>
                <IoChevronDownSharp />
              </div>
              {leaveDropdown && (
                <div className="dropdown-content">
                  <ul>
                    <li onClick={() => handleLeaveTypeSelection(0)}>
                      <p className="type">Comp Offs</p>
                      <p className="status">Not Available</p>
                    </li>
                    <li onClick={() => handleLeaveTypeSelection(1)}>
                      <p className="type">General Leave</p>
                      <p className="status">{leavesData}</p>
                    </li>
                    <li onClick={() => handleLeaveTypeSelection(2)}>
                      <p className="type">Unpaid Leave</p>
                      <p className="status">Infinite Balanace</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {selectedLeave !== "Select" &&
              (numberOfDays === 1 || numberOfDays === 0.5) && (
                <div>
                  <div className="day-type">
                    <button
                      onClick={() => handleDays(0)}
                      className={isActive ? "" : "active"}
                    >
                      Full Day
                    </button>
                    <button
                      onClick={() => handleDays(1)}
                      className={isActive ? "active" : ""}
                    >
                      Half Day
                    </button>
                  </div>
                  <div className="leave-info">
                    <p>You are Requesting {numberOfDays} Days of Leave</p>
                  </div>
                </div>
              )}
            {selectedLeave !== "Select" &&
              numberOfDays !== 1 &&
              numberOfDays !== 0.5 && (
                <div className="leave-info">
                  <p>You are Requesting {numberOfDays} Days of Leave</p>
                </div>
              )}

            <div className="note">
              <label htmlFor="">Note</label>
              <Input
                onFocus={handelFocus}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type here"
              />
            </div>
            <div className="notify">
              <label htmlFor="">Notify</label>
              <Space
                style={{
                  width: "100%",
                }}
                direction="vertical"
              >
                <Select
                  filterOption={false}
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleChange}
                  value={selectedUsers}
                  options={options}
                  onSearch={handleSearch}
                  dropdownRender={(menu) =>
                    loading ? (
                      <Spin />
                    ) : options.length === 0 && lengthofText >= 3 ? (
                      <div style={{ padding: 8, opacity: 0.5 }}>
                        No data available
                      </div>
                    ) : options.length === 0 && lengthofText < 3 ? (
                      <div style={{ padding: 8, opacity: 0.5 }}>
                        Please type three words
                      </div>
                    ) : (
                      menu
                    )
                  }
                  showSearch={true}
                  showArrow={false}
                ></Select>
              </Space>
            </div>

            <div
              className="btn-container"
              style={{ position: "absolute", top: "95%", left: "60%" }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 22px 8px 22px",
                  marginRight: "10px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  boxShadow: "3px 0 6px 0 #d8dde6",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                style={{
                  padding: "8px 22px 8px 22px",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#2986ce",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="graphic-content-container">
        <div className="graphic-content">
          <h2> Leave Balances</h2>
          <Row gutter={[16, 16]}>
            <Col sm={12} lg={6}>
              <div className="comp-offs-data">
                <div
                  className="comp-graph"
                  style={{ justifyContent: "flex-start" }}
                >
                  <h3 style={{ fontSize: "14px", fontWeight: "200px" }}>
                    Comp Offs{" "}
                  </h3>

                  <p
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "40%",
                      opacity: "0.5",
                    }}
                  >
                    No data to display
                  </p>
                </div>
                <div className="numerical-data">
                  <div className="present-status">
                    <div className="status">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        AVAILABLE
                      </p>
                      <p
                        className="f-weigth"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        0 day
                      </p>
                    </div>
                    <div className="status border-left">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        CONSUMED
                      </p>
                      <p className="f-weigth">0 day</p>
                    </div>
                  </div>
                  <div className="annual-data">
                    <p
                      style={{
                        opacity: "0.5",
                        fontSize: "14px",
                        fontWeight: "200px",
                        marginBottom: "8px",
                      }}
                    >
                      ANNUAL QUOTA
                    </p>
                    <p className="f-weigth">0 day</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={12} lg={6}>
              <div className="comp-offs-data">
                <div className="comp-graph">
                  <h3 style={{ fontSize: "14px" }}>General Leave </h3>
                  <div className="graph">
                    {percentageofConsumed || percentageofAvailable ? (
                      <PieChart
                        data={[
                          {
                            title: "Variable 1",
                            value: percentageofConsumed,
                            color: "#E38627",
                          },
                          {
                            title: "Variable 2",
                            value: percentageofAvailable,
                            color: "#6A2135",
                          },
                        ]}
                        lineWidth={lineWidth}
                        label={() => null}
                        radius={radius}
                        segmentsStyle={{
                          transition: "stroke .3s",
                          cursor: "pointer",
                        }}
                      >
                        <text
                          x={textX}
                          y={textY}
                          dy="-1em"
                          textAnchor="middle"
                          style={{ fill: "#000", fontSize: "10px" }}
                        >
                          <tspan x={textX} dy="1.2em">
                            Available
                          </tspan>
                          <tspan x={textX} dy="1.2em">
                            {consumedData?.available?.generalLeaveCount} days
                          </tspan>
                        </text>
                      </PieChart>
                    ) : (
                      <p
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "40%",
                          opacity: "0.5",
                        }}
                      >
                        No data to display
                      </p>
                    )}
                  </div>
                </div>
                <div className="numerical-data">
                  <div className="present-status">
                    <div className="status">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        AVAILABLE
                      </p>
                      <p
                        className="f-weigth"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {consumedData?.available?.generalLeaveCount
                          ? `${consumedData?.available?.generalLeaveCount} days`
                          : "0 days"}
                      </p>
                    </div>
                    <div className="status border-left">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        CONSUMED
                      </p>
                      <p
                        className="f-weigth"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {consumedData?.consumed?.generalLeaveCount
                          ? `${consumedData?.consumed?.generalLeaveCount} days`
                          : "0 days"}
                      </p>
                    </div>
                  </div>
                  <div className="present-status">
                    <div className="status">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        ACCRUED SO FAR
                      </p>
                      <p
                        className="f-weigth"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {consumedData?.consumed?.generalLeaveCount
                          ? `${consumedData?.available?.accuredSoFar} days`
                          : "0 days"}
                      </p>
                    </div>
                    <div className="status border-left">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        ANNUAL QUOTA
                      </p>
                      <p
                        className="f-weigth"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {consumedData?.consumed?.generalLeaveCount
                          ? `${consumedData?.annualquota?.generalLeaveCount} days`
                          : "0 days"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={12} lg={6}>
              <div className="comp-offs-data">
                <div
                  className="comp-graph"
                  style={{ justifyContent: "flex-start" }}
                >
                  <h3 style={{ fontSize: "14px", fontWeight: "200px" }}>
                    Unpaid Leave{" "}
                  </h3>

                  <p
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "40%",
                      opacity: "0.5",
                    }}
                  >
                    No data to display
                  </p>
                </div>
                <div className="numerical-data">
                  <div className="present-status">
                    <div className="status">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        AVAILABLE
                      </p>
                      <p
                        className="f-weigth"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        <BsInfinity />
                      </p>
                    </div>
                    <div className="status border-left">
                      <p
                        style={{
                          opacity: "0.5",
                          fontSize: "14px",
                          fontWeight: "200px",
                          marginBottom: "7px",
                        }}
                      >
                        CONSUMED
                      </p>
                      <p className="f-weigth">
                        <BsInfinity />
                      </p>
                    </div>
                  </div>
                  <div className="annual-data">
                    <p
                      style={{
                        opacity: "0.5",
                        fontSize: "14px",
                        fontWeight: "200px",
                        marginBottom: "8px",
                      }}
                    >
                      ANNUAL QUOTA
                    </p>
                    <p className="f-weigth">
                      <BsInfinity />
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};
export default Leaves;
