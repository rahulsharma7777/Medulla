import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import { getUsers } from "../services/Index";
const ManageAttendence = () => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleView = (data) => {
    const id = data._id;
    navigate(`/user-attendence/${id}`);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "user_name",
      key: "name",
      render: (text, record) => {
        return text || "NA";
      },
    },
    {
      title: "Team-Name",
      dataIndex: "team_id",
      key: "Team",
      render: (item) => {
        if (item) {
          return item.team_name;
        } else {
          return "NA";
        }
      },
    },
    {
      title: "Shift",
      dataIndex: "shift_id",
      key: "shift",
      render: (item) => {
        if (item) {
          return item.name;
        } else {
          return "NA";
        }
      },
    },

    {
      title: "Attendence",
      dataIndex: "",
      key: "y",
      render: (_, record) => (
        <span
          className="view-action  hover-highlight"
          onClick={() => handleView(record)}
        >
          View
        </span>
      ),
    },
  ];
  async function getList() {
    try {
      dispatch(showLoader());
      const res = await getUsers();

      setList(res?.data);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="manage-teams">
      <div>
        <Input name="search" placeholder="Search here..." />
      </div>
      <div className="teams-table">
        <Table columns={columns} dataSource={list} />
      </div>
    </div>
  );
};
export default ManageAttendence;
