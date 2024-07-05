import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { Space, TimePicker } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { addShift } from "../services/Index";
const AddNewShift = ({ isOpen, onClose, reLoad }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [name, setName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      return toast.warning("Please add shift timings", {
        autoClose: 2000,
      });
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    const res = await addShift(formData);

    if (res.status === 200) {
      setDateStart("");
      setDateEnd("");
      setName("");
      reLoad();
      onClose();
      toast.success("Shift Added Successfully", {
        autoClose: 2000,
      });
    }
  };

  const onStartValueChange = (value) => {
    setDateStart(value);
    if (value) {
      const temp = moment(value?.$d).toString();
      setStartTime(temp);
    } else {
      setStartTime("");
    }
  };

  const onEndValueChange = (value) => {
    setDateEnd(value);
    if (value) {
      const temp = moment(value?.$d).toString();
      setEndTime(temp);
    } else {
      setEndTime("");
    }
  };
  return (
    <Modal
      footer={null}
      className="add-org-modal"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
    >
      <div className="Modal-content">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="">Shift Name:</label>
            <Input
              size="large"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="shif-time-pickers">
            <Space wrap>
              <TimePicker
                use12Hours
                format="h:mm A"
                placeholder="Start Time"
                onChange={onStartValueChange}
                value={dateStart}
              />
            </Space>
            <Space wrap>
              <TimePicker
                use12Hours
                format="h:mm A"
                placeholder="Ending Time"
                onChange={onEndValueChange}
                value={dateEnd}
              />
            </Space>
          </div>

          <div className="mb-3">
            <button type="submit" className="primary-btn w-full">
              Add Shift
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddNewShift;
