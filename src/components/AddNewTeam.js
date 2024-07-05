import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Modal, Input } from "antd";
import { Dropdown } from "primereact/dropdown";
import { getUsers, addTeam, editTeam } from "../services/Index";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";

const AddNewTeam = ({
  isOpen,
  onClose,
  onDone,
  data,
  onChange,
  isChange,
  setIsColor,
}) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const onCloseColor = () => {
    setIsColor();
    onClose();
    if (isChange) {
      onChange();
    }
  };
  const onCloseState = () => {
    onclose();
    if (isChange) {
      onChange();
    }
  };
  useEffect(() => {
    if (isChange) {
      setName(data?.team_name);
      setSelectedUser(data?.manager_id?._id);
    } else {
      setName("");
      setSelectedUser("");
    }
  }, [data, isChange]);
  const handleSubmit = async (e) => {
    if (isChange) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("team_name", name);
      formData.append("manager_id", selectedUser);
      try {
        dispatch(showLoader());
        const res = await editTeam(formData, data._id);
        if (res.status === 200) {
          setSelectedUser("");
          setName("");
          onChange();
          onClose();
          onDone();
          toast.success("Team Updated Successfully");
        } else {
          toast.error(res.error_message);
        }
      } catch (error) {
      } finally {
        dispatch(hideLoader());
        setName("");
        onChange();
        onClose();
        onDone();
      }
    } else {
      e.preventDefault();

      dispatch(showLoader());
      const formData = new FormData();
      formData.append("team_name", name);
      formData.append("manager_id", selectedUser);
      try {
        const res = await addTeam(formData);
        console.log(" here is response", res);
        if (res.status === 200) {
          setSelectedUser("");
          setName("");
          setIsColor();
          onClose();
          onDone();
          toast.success("Team Added Successfully!!");
        } else {
          toast.error(res.errorMessage);
        }
      } catch (error) {
        console.log(" here is error", error);
      } finally {
        dispatch(hideLoader());
        setSelectedUser("");
        setName("");
        setIsColor();
        onClose();
        onDone();
      }
    }
  };
  async function getList() {
    try {
      const res = await getUsers();

      const options = res?.data?.map((user) => ({
        name: user.user_name,
        value: user._id,
      }));
      setUsers(options);
    } catch (error) {}
  }
  useEffect(() => {
    getList();
  }, []);

  const selectedCityTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };
  const cityOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };
  return (
    <Modal
      footer={null}
      className="add-org-modal"
      open={isOpen}
      onOk={onCloseState}
      onCancel={onCloseColor}
    >
      <div className="Modal-content">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="">Team Name:</label>
            <Input
              size="large"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <label htmlFor="">Manager:</label>
          <div className="card flex justify-content-center   manager-dropdown">
            <Dropdown
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.value)}
              options={users}
              filter
              valueTemplate={selectedCityTemplate}
              temTemplate={cityOptionTemplate}
              optionLabel="name"
              placeholder="Select the Manager"
              required
              className="w-full md:w-14rem "
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="primary-btn w-full">
              {data ? " Edit Team" : "Add Team"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddNewTeam;
