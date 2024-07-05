import { useEffect, useState } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Input } from "antd";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import { addNewOrg, editNewOrg } from "../services/Index";
import { editMode, loadMode } from "../redux/slice/editmodeSlice";
const AddNewOrg = ({ isOpen, onClose, orgData, setIsActive }) => {
  const [orgName, setOrgName] = useState("");
  const [orgLocation, setOrgLocation] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [ipAddress, setIPAddress] = useState("");
  const isEdit = useSelector((state) => state.editMode.isEdit);
  const dispatch = useDispatch();
  const closeAddModal = () => {
    if (setIsActive) {
      setIsActive();
    }

    onClose();
  };
  useEffect(() => {
    if (orgData) {
      setOrgName(orgData.org_name);
      setOrgLocation(orgData.org_location);
      setContact(orgData.org_contact);
      setEmail(orgData.org_email);
      setIPAddress(orgData.org_ip);
    } else {
      setOrgName("");
      setOrgLocation("");
      setContact("");
      setEmail("");
      setIPAddress("");
    }
  }, [orgData]);

  const handleSubmit = async (e, isEdit) => {
    if (contact.length !== 10) {
      return toast.error("Contact number must be 10 digits");
    }
    e.preventDefault();
    const formData = new FormData();
    formData.append("org_name", orgName);
    formData.append("org_location", orgLocation);
    formData.append("org_contact", contact);
    formData.append("org_email", email);
    formData.append("org_ip", ipAddress);
    if (!isEdit) {
      try {
        dispatch(showLoader());
        const response = await addNewOrg(formData);
        if (response.status === 200) {
          toast.success("Added Successfully");
          setIsActive();
          onClose();
          dispatch(loadMode());
        } else {
          toast.error("There is Error");
        }
      } catch (error) {
      } finally {
        dispatch(hideLoader());
      }
    } else {
      try {
        dispatch(showLoader());
        const response = await editNewOrg(formData, orgData._id);
        if (response.status === 200) {
          toast.success("Updated Successfully");
          dispatch(editMode());
          onClose();
          dispatch(loadMode());
        } else {
          toast.error("There is Error");
        }
      } catch (error) {
      } finally {
        dispatch(hideLoader());
      }
    }

    setOrgName("");
    setOrgLocation("");
    setContact("");
    setEmail("");
    setIPAddress("");
  };

  return (
    <Modal
      footer={null}
      className="add-org-modal"
      open={isOpen}
      onOk={onClose}
      onCancel={closeAddModal}
    >
      <div className="Modal-content">
        <h2 className="mb-3">
          {isEdit ? "Edit Organization" : "Add New Organization"}
        </h2>
        <form onSubmit={(e) => handleSubmit(e, isEdit)}>
          <div className="mb-3">
            <label htmlFor="">Organization Name:</label>
            <Input
              size="large"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              {...(!isEdit ? { required: true } : {})}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Location:</label>
            <Input
              size="large"
              type="text"
              value={orgLocation}
              onChange={(e) => setOrgLocation(e.target.value)}
              {...(!isEdit ? { required: true } : {})}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Contact:</label>
            <Input
              size="large"
              type="number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              {...(!isEdit ? { required: true } : {})}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Email:</label>
            <Input
              size="large"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...(!isEdit ? { required: true } : {})}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="">IP Address:</label>
            <Input
              size="large"
              type="Text"
              value={ipAddress}
              onChange={(e) => setIPAddress(e.target.value)}
              {...(!isEdit ? { required: true } : {})}
            />
          </div>

          <div className="mb-3">
            <button type="submit" className="primary-btn w-full">
              {isEdit ? "Update Org" : "Add Org"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddNewOrg;
