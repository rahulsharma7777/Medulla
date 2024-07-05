import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { MdArrowForwardIos } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Space, TimePicker } from "antd";
import { InputText } from "primereact/inputtext";
import { Input } from "antd";
import moment from "moment";
import { Radio } from "antd";
import { Select, Spin } from "antd";
import {
  getFormattedTime,
  isTimeBetween,
} from "../components/common/Timerfunctions";
import { getOrgUsers, getManager, applyPartialDay } from "../services/Index";

import { showLoader, hideLoader } from "../redux/slice/loaderSlice";

const { TextArea } = Input;
const ApplyPartialDay = ({ isOpen, onClose, applyDate }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [options, setOptions] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [lengthofText, setLengthOfText] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [manager, setManager] = useState("");
  const [value, setValue] = useState(1);
  const [minutes, setMinutes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [shifStart, setShiftStart] = useState("");
  const [shifEnd, setShiftEnd] = useState("");
  const dispatch = useDispatch();
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const shift = useSelector((state) => state.shiftDetails.shift);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onValueChange = (time, timeString) => {
    if (!shift) {
      return toast.error("Invalid Shift!!");
    }
    console.log("time", time);
    if (time) {
      const start = moment(shift.startTime).local()._d;
      const end = moment(shift.endTime).local()._d;
      const flag = isTimeBetween(start, end, moment(time));
      if (!flag) {
        return toast.warning("Select timing between shift");
      }
    }

    setStartTime(time);
  };
  const handleChange = (selectedValues) => {
    const uniqueSelectedValues = [...new Set(selectedValues)];

    setSelectedUsers(uniqueSelectedValues);
  };
  const handleSearch = async (value) => {
    setSearchText(value);
  };
  const onTextChange = (value) => {
    setComment(value);
  };
  const fetchData = async (value) => {
    try {
      setLoading(true);
      const response = await getOrgUsers(value);
      const dropdownOptions = response?.data?.map((ele) => {
        return {
          value: ele._id,
          label: ele.user_name,
        };
      });
      if (response === 400) {
        setOptions([]);
      } else {
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
  async function getDetailsofManager() {
    const res = await getManager();
    if (res.status === 200) {
      setManager(res?.data[0]?.manager_details?._id);
    }
  }

  useEffect(() => {
    if (shift) {
      setShiftStart(getFormattedTime(shift.startTime));
      setShiftEnd(getFormattedTime(shift.endTime));
    }
  }, [shift]);
  useEffect(() => {
    if (applyDate) {
      const parsedDate = new Date(applyDate);
      setStartDate(parsedDate);
    }
    getDetailsofManager();
  }, [applyDate]);
  useEffect(() => {
    const trimmedSearchText = searchText.trim();
    const words = trimmedSearchText.split(/\s+/);
    const lastWord = words.pop().trim();

    const lengthOfLastWord = lastWord.length;
    setLengthOfText(lengthOfLastWord);
    if (lengthOfLastWord >= 3) {
      fetchData(lastWord);
    } else {
      setOptions([]);
    }
  }, [searchText]);

  const handleRequest = async () => {
    if (!shift) {
      return toast.error("Invalid Shift!!");
    }
    if (value === 2 && !startTime) {
      return toast.info(" Please Select Leaving Time", {
        autoClose: 2000,
      });
    }
    if (!minutes) {
      return toast.info(" Please Select Minutes", {
        autoClose: 2000,
      });
    }
    if (!comment) {
      return toast.info(" Please write the reason", {
        autoClose: 2000,
      });
    }
    let formattedUsers = selectedUsers;
    if (manager) {
      formattedUsers = selectedUsers.includes(manager)
        ? selectedUsers
        : [...selectedUsers, manager];
    }

    const formattedDate = moment(startDate)
      .set({ hour: 0, minute: 0, second: 0 })
      .toString();
    const date = moment();
    const formattedISTDate = moment(date).toString();
    let data = {
      type: value,
      date: formattedDate,
      applied_date: formattedISTDate,
      minutes: minutes,
      reason: comment,
      receiver_ids: formattedUsers,
    };

    if (value === 2) {
      const temp = moment(startTime?.$d).toString();
      data.time = temp;
    }
    try {
      dispatch(showLoader());
      const res = await applyPartialDay(data);
      if (res.status === 200) {
        toast.success("woah! Applied Successfully", {
          autoClose: 2000,
        });
        setSelectedUsers([]);
        setOptions([]);
        setMinutes("");
        setStartDate(new Date());
        setSearchText("");
        setValue("");
        setStartTime("");
        setComment("");
        onClose();
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };
  const handleCancel = () => {
    onClose();
    setComment("");
  };
  const onMinutesChange = (data) => {
    if (value === 2) {
      if (!startTime) {
        return toast.info("select leaving time");
      }
    }
    if (data > 480) {
      return toast.warning("Minutes should not exceeds 480", {
        autoClose: 2000,
      });
    }
    setMinutes(data);
  };
  return (
    <>
      <Modal
        className="partialday-modal"
        title="Partial Day Request"
        style={{
          top: 20,
          width: "650px",
        }}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="request" type="primary" onClick={handleRequest}>
            Request
          </Button>,
        ]}
        open={isOpen}
        onOk={onClose}
        onCancel={onClose}
        Style={{ maxHeight: "80vh", overflowY: "auto" }}
        okText="Request"
      >
        <p>Select Date</p>
        <div className="from-modal">
          <DatePicker
            onCalendarClose={() => {}}
            selected={startDate}
            onChange={handleStartDateChange}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
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
        <p style={{ opacity: "0.5" }}>
          Shift timings: {shifStart} - {shifEnd}
        </p>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Late Arrival</Radio>
          <Radio value={2}>Intervening Time-off</Radio>
          <Radio value={3}>Leaving Early</Radio>
        </Radio.Group>
        {value === 1 && (
          <div className="late-arrival-timing-data">
            <h3>Will come late by</h3>
            <InputText
              keyfilter="int"
              onChange={(e) => onMinutesChange(e.target.value)}
            />
            <h3>minutes</h3>
          </div>
        )}
        {value === 3 && (
          <div className="late-arrival-timing-data">
            <h3>Will leave early by</h3>
            <InputText
              keyfilter="int"
              onChange={(e) => onMinutesChange(e.target.value)}
            />
            <h3>minutes</h3>
          </div>
        )}

        {value === 2 && (
          <div className="intervening-time-off-data">
            <h3>Will leave at</h3>
            <Space wrap>
              <TimePicker use12Hours format="h:mm A" onChange={onValueChange} />
            </Space>
            <h3>for a duration of</h3>
            <InputText
              keyfilter="int"
              onChange={(e) => onMinutesChange(e.target.value)}
            />
            <h3>minutes</h3>
          </div>
        )}

        <div className="reason-input">
          <h3 style={{ fontSize: "15px", fontWeight: "400" }}>Reason</h3>
          <TextArea
            value={comment}
            showCount
            maxLength={100}
            onChange={(e) => onTextChange(e.target.value)}
            style={{
              height: 80,
              resize: "none",
            }}
          />
        </div>
        <div className="notify">
          <h3
            className="notify-title"
            style={{ fontSize: "15px", fontWeight: "400" }}
          >
            Notify
          </h3>
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
      </Modal>
    </>
  );
};
export default ApplyPartialDay;
