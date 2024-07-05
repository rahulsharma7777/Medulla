import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getShiftUsers } from "../services/Index";
import { Button, Table } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { hideLoader, showLoader } from "../redux/slice/loaderSlice";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { Card } from "antd";
import { Input } from "antd";
import AddNewUser from "../components/AddNewUser";
import deleteIcon from "../Assests/Images/delete.png";
import { getFormattedTime } from "../components/common/Timerfunctions";

const ManageUsers = () => {
  const [isUsers, setIsUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isData, setIsData] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isColor, setIsColor] = useState(false);
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const columns = [
    {
      title: "User",
      dataIndex: "user_name",
      key: "user",
      render: (user_name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.profile_img}
            alt={user_name}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <span>{user_name}</span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "user_contact",
      key: "contact",
    },
    {
      title: "Team-Name",
      dataIndex: "team_id",
      key: "team",
      render: (item) => {
        if (item) {
          return item.team_name;
        } else {
          return "NA";
        }
      },
    },
  ];
  if (location.pathname === "/manage-users") {
    columns.push({
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
    });

    columns.push({
      title: "Edit User",
      dataIndex: "",
      key: "z",
      render: (_, record) => (
        <div className="table-btn">
          <img
            onClick={() => {
              Modal.confirm({
                title: "Confirm",
                content: "Are you sure you want to delete this user?",
                footer: (_, { OkBtn, CancelBtn }) => (
                  <>
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        handleDelete(record);
                        Modal.destroyAll();
                      }}
                    >
                      Delete
                    </Button>
                    <CancelBtn />
                  </>
                ),
              });
            }}
            src={deleteIcon}
            alt="edit"
          />
        </div>
      ),
    });
  }
  if (location.pathname !== "/manage-users") {
    columns.push({
      title: "Email",
      dataIndex: "user_email",
      key: "o",
    });
  }

  const handleDelete = async (data) => {
    setIsOpen(false);
    const load = data._id;
    const res = await deleteUser(load);
    if (res.status === 200 || res.status === 201) {
      getTeam();
    }

    if (res.status === 400) {
      toast.error("Can't Delete Manager of a Team!!!");
    }
  };

  const handleRowSelect = (record) => {
    setIsOpen(true);
    setIsEdit(true);
    setIsData(record);
  };
  async function getTeam() {
    try {
      if (location.pathname === "/manage-users") {
        dispatch(showLoader());
        const res = await getUsers();

        setIsUsers(res.data);
      } else {
        dispatch(showLoader());
        if (id) {
          const res = await getShiftUsers(id);
          setIsUsers(res.data.users);
          setTitle(res.data.shift.name);
          setCount(res.data.count);
          setStart(getFormattedTime(res.data.shift.startTime));
          setEnd(getFormattedTime(res.data.shift.endTime));
        }
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }

  useEffect(() => {
    getTeam();
  }, [isSubmit, id]);

  const handleClick = () => {
    setIsOpen(true);
    setIsEdit(false);
    setIsColor(true);
  };

  return (
    <div className="manage-teams">
      <div
        className="user-add-btn text-right"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <Input name="search" placeholder="Search here..." />
        </div>
        {location.pathname === "/manage-users" && (
          <button
            className={`primary-btn mr-3 ${isColor ? "active" : ""}`}
            onClick={handleClick}
          >
            Add User
          </button>
        )}
      </div>
      {location.pathname !== "/manage-users" && (
        <div className="user-shift-card">
          <Card
            title={
              <div className="title-wrapper">
                <span
                  style={{
                    fontSize: "16px",
                    marginRight: "8px",
                    fontWeight: "600",
                  }}
                >
                  Shift-Name
                </span>
                <span style={{ fontSize: "16px", fontWeight: "400" }}>
                  {title}
                </span>
              </div>
            }
            bordered={false}
            style={{
              width: 250,
              height: 170,
              borderRadius: 8,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            headStyle={{
              backgroundColor: " #f2f2f1",
              borderTop: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
              width: "100%",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <div className="shift-card-contents">
              <p className="shift-card-paragraph">No Of Employees </p>
              <p style={{ fontSize: "15px", fontWeight: "400" }}>{count}</p>
            </div>
            <div className="shift-card-contents">
              <p className="shift-card-paragraph">Start Time </p>
              <p style={{ fontSize: "15px", fontWeight: "400" }}>{start}</p>
            </div>
            <div className="shift-card-contents">
              <p className="shift-card-paragraph">End Time</p>
              <p style={{ fontSize: "15px", fontWeight: "400" }}> {end}</p>
            </div>
          </Card>
        </div>
      )}
      <div
        className={
          location.pathname === "/manage-users"
            ? "team-table"
            : "table-with-heading"
        }
      >
        <Table
          columns={columns}
          dataSource={isUsers}
          rowClassName={() => "table-row-hover"}
          onRow={
            location.pathname === "/manage-users"
              ? (record) => {
                  return {
                    onClick: (e) => {
                      if (e.target.tagName.toLowerCase() !== "img") {
                        handleRowSelect(record);
                      }
                    },
                  };
                }
              : undefined
          }
        />
      </div>
      <AddNewUser
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsColor(false);
        }}
        isEdit={isEdit}
        data={isData}
        reload={() => setIsSubmit((prev) => !prev)}
      />
    </div>
  );
};
export default ManageUsers;
