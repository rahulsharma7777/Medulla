import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddNewShift from "../components/AddShift";
import { getShifts } from "../services/Index";
import { hideLoader, showLoader } from "../redux/slice/loaderSlice";
import { getFormattedTime } from "../components/common/Timerfunctions";
const ManageShifts = () => {
  const [isColor, setIsColor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [handleReload, setHandleReload] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return text || "NA";
      },
    },
    {
      title: "From",
      dataIndex: "startTime",
      key: "Team",
      render: (item) => {
        return getFormattedTime(item);
      },
    },
    {
      title: "To",
      dataIndex: "endTime",
      key: "Team",
      render: (item) => {
        return getFormattedTime(item);
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "X",
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
  const getAllShifts = async () => {
    try {
      dispatch(showLoader());
      const res = await getShifts();
      setData(res.data);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };
  const handleView = (record) => {
    navigate(`/manage-shifts/users/${record._id}`);
  };
  useEffect(() => {
    getAllShifts();
  }, [handleReload]);

  return (
    <div className="manage-shifts manage-teams">
      <div className="Add-shift-btn  team-add-btn text-right">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsColor(true);
          }}
          className={`primary-btn mr-3 ${isColor ? "active" : ""}`}
        >
          Add Shift
        </button>
      </div>
      <div className="teams-table shift-table">
        <Table columns={columns} dataSource={data} />
      </div>
      <AddNewShift
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsColor(false);
        }}
        reLoad={() => setHandleReload((prev) => !prev)}
      />
    </div>
  );
};
export default ManageShifts;
