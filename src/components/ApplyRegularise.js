import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import { ApplyforRegularise, getManager } from "../services/Index";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
const { TextArea } = Input;
const ApplyRegularise = ({ isOpen, onClose, Dateof }) => {
  const [comment, setComment] = useState(null);
  const [manager, setManager] = useState([]);
  const [regulariseDay, setRegulariseDay] = useState("");
  const dispatch = useDispatch();
  const handleCancel = () => {
    onClose();
    setComment("");
  };
  const handleRequest = async () => {
    if (!manager) {
      return toast.error("User Does not have a Manager");
    }
    if (!comment) {
      return toast.info("Please write note", {
        autoClose: 2000,
      });
    }
    const date = moment();
    const formattedISTDate = moment(date)
      .set({ hour: 0, minute: 0, second: 0 })
      .toString();
    const newDate = moment(Dateof)
      .set({ hour: 0, minute: 0, second: 0 })
      .toString();

    const payload = {
      date: newDate,
      type: 1,
      note: comment,
      receiver_ids: [manager],
      applied_date: formattedISTDate,
    };
    try {
      dispatch(showLoader());
      const res = await ApplyforRegularise(payload);
      if (res.status === 200) {
        toast.success("woah! Applied Successfully", {
          autoClose: 2000,
        });
        onClose();
        setComment("");
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };
  async function getManagerDetails() {
    const res = await getManager();
    setManager(res.data[0]?.manager_details?._id);
  }
  const getCurrentDateFormatted = () => {
    const currentDate = new Date(Dateof);
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    setRegulariseDay(formattedDate);
  };
  useEffect(() => {
    getManagerDetails();
    getCurrentDateFormatted();
  }, [Dateof]);
  return (
    <>
      <Modal
        className="regularization-modal"
        title={`Request Attendance Regularization ${regulariseDay}`}
        style={{
          top: 20,
        }}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="request" type="primary" onClick={handleRequest}>
            Request
          </Button>,
        ]}
        visible={isOpen}
        onOk={onClose}
        onCancel={onClose}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        okText="Request"
      >
        <p className="regularise-text">
          Raise regularization request to exempt this day from tracking policy
          penalization
        </p>
        <h3 className="regularise-note">Note</h3>
        <TextArea
          value={comment}
          showCount
          maxLength={100}
          onChange={(e) => setComment(e.target.value)}
          style={{
            height: 120,
            resize: "none",
          }}
        />
      </Modal>
    </>
  );
};
export default ApplyRegularise;
