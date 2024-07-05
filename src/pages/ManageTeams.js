import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { IoPersonAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import deleteIcon from "../Assests/Images/delete.png";
import editIcon from "../Assests/Images/edit.png";
import { toast } from "react-toastify";
import { Modal, Input } from "antd";
import { getTeams, deleteTeam } from "../services/Index";
import AddNewTeam from "../components/AddNewTeam";
import AddNewUser from "../components/AddNewUser";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
const ManageTeams = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTeam, setIsTeam] = useState([]);
  const [isAdd, setIsAdd] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [data, setData] = useState("");
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [team, setTeam] = useState("");
  const [teamId, setTeamId] = useState("");
  const [isChange, setIsChange] = useState(false);
  const [isColor, setIsColor] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columns = [
    {
      title: "Team-Name",
      dataIndex: "team_name",
      key: "name",
    },
    {
      title: "Manager-Name",
      dataIndex: "manager_id",
      key: "age",
      render: (item) => {
        if (item) {
          return item.user_name;
        } else {
          return null;
        }
      },
    },

    {
      title: "Members",
      dataIndex: "count",
      key: "address",
    },
    {
      title: "Add Memeber",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <IoPersonAddOutline
          className=" hover-highlight"
          onClick={() => handleAddMemberClick(record)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "y",
      render: (_, record) => {
        return (
          <span
            className="view-action  hover-highlight"
            onClick={() => handleView(record?._id)}
          >
            View
          </span>
        );
      },
    },
    {
      title: "Edit Team",
      dataIndex: "",
      key: "z",
      render: (_, record) => (
        <div className="table-btn">
          <img
            onClick={() => handleEdit(record)}
            src={editIcon}
            alt="delete"
          ></img>
          {record.count === 0 && (
            <img
              onClick={() => {
                Modal.confirm({
                  title: "Confirm",
                  content: "Are you sure you want to delete this Team?",
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
          )}
        </div>
      ),
    },
  ];
  const handleAddMemberClick = (data) => {
    setTeam(data.team_name);
    setTeamId(data._id);
    setIsUserOpen(true);
  };

  const handleClick = () => {
    setIsOpen(true);
    setIsColor(true);
  };
  const handleDelete = async (data) => {
    const load = { team_name: data.team_name };
    const res = await deleteTeam(load);
    if (res.status === 200) {
      setIsReload((prev) => !prev);
      toast.success("team deleted successfully!!", {
        autoClose: 2000,
      });
    }
  };
  const handleEdit = (data) => {
    setIsOpen(true);
    setData(data);
    setIsChange(true);
  };
  const handleView = async (id) => {
    navigate(`/org/employees/tree/${id}`);
  };
  async function getTeam() {
    try {
      dispatch(showLoader());
      const res = await getTeams();
      if (res.status === 200) {
        setIsTeam(res.data);
      }

      setIsAdd(false);
    } catch (error) {
      toast.error(" there is a error");
    } finally {
      dispatch(hideLoader());
    }
  }
  useEffect(() => {
    getTeam();
  }, [isReload, isAdd]);

  return (
    <div className="manage-teams">
      <div
        className="team-add-btn text-right "
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <Input name="search" placeholder="Search here..." />
        </div>

        <button
          className={`primary-btn mr-3 ${isColor ? "active" : ""}`}
          onClick={handleClick}
        >
          Add Team
        </button>
      </div>
      <div className="teams-table">
        <Table columns={columns} dataSource={isTeam} />
      </div>
      <AddNewTeam
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDone={() => setIsAdd(true)}
        data={data}
        isChange={isChange}
        onChange={() => setIsChange(false)}
        setIsColor={() => setIsColor(false)}
      />
      <AddNewUser
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
        team={team}
        teamId={teamId}
        isTeam={true}
        reload={() => setIsReload((prev) => !prev)}
      />
    </div>
  );
};
export default ManageTeams;
