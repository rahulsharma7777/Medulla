import React, { useState, useEffect } from "react";
import CardItem from "../components/common/Card";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "antd";
import { getOrgList } from "../services/Index";
import AddNewOrg from "../components/AddNewOrg";
import { changeMode } from "../redux/slice/editmodeSlice";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";

const Organization = () => {
  const [org, setOrg] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isLoad = useSelector((state) => state.editMode.isLoad);
  const isEdit = useSelector((state) => state.editMode.isEdit);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOrgList();
  }, [isLoad]);

  async function fetchOrgList() {
    try {
      dispatch(showLoader());
      const orgList = await getOrgList();
      setOrg(orgList?.data);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }

  const handleAdd = () => {
    if (isEdit) {
      dispatch(changeMode());
    }
    setIsOpen(true);
    setIsActive(true);
  };

  const handleDelete = () => {
    dispatch(changeMode());
  };
  return (
    <>
      <div className="card-topbar">
        <div>
          <Input name="search" placeholder="Search here..." />
        </div>
        <div className="action-buttons">
          <button
            className={`primary-btn mr-3 ${isActive ? "active" : ""}`}
            onClick={handleAdd}
          >
            Add Org
          </button>
          <button
            className={`primary-btn  ${isEdit ? "active" : ""}`}
            onClick={handleDelete}
          >
            Edit Org
          </button>
        </div>
      </div>
      <div>
        <CardItem Items={org} />
        <div className="add-org-container">
          <AddNewOrg
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            setIsActive={() => setIsActive(false)}
          />
        </div>
      </div>
    </>
  );
};
export default Organization;
