import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { Modal, Input } from "antd";
import { useDispatch } from "react-redux";
import { addSubadmin } from "../services/Index";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";

const AddNewSubadmin = ({ isOpen, onClose, Id, setIsReload }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("org_id", Id);
    formData.append("user_contact", contact);
    formData.append("user_address", address);
    try {
      dispatch(showLoader());
      const response = await addSubadmin(formData);
      if (response.status === 200) {
        setIsReload();
        onClose();
        setName("");
        setEmail("");
        setAddress("");
        setContact("");
        toast.success("Added Successfully");
      } else {
        toast.error(" There is a error");
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
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
        <h2 className="mb-3">Add Subadmin</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="">Subadmin Name:</label>
            <Input
              size="large"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="">Email:</label>
            <Input
              size="large"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="">Contact:</label>
            <Input
              size="large"
              type="user_contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="">Address:</label>
            <Input
              size="large"
              type="user_address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <button type="submit" className="primary-btn w-full">
              Add SubAdmin
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddNewSubadmin;
