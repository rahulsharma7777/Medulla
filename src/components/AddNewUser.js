import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Input } from "antd";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import { addUser, getTeams, getShifts, updateUser } from "../services/Index";
const AddNewUser = ({
  isOpen,
  onClose,
  isEdit,
  teamId,
  team,
  data,
  isTeam,
  reload,
  reLoad,
}) => {
  const [form, setForm] = useState({});
  const [teamList, setTeamList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedShift, setSelectedShift] = useState([]);
  const [teamError, setTeamError] = useState(null);
  const [shiftError, setShiftError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isTeam) {
      setSelectedTeam(teamId);
    } else if (data && isEdit) {
      setForm(data);
      setSelectedTeam(
        teamList.find((team) => team.name === data?.team_id?.team_name)?.value
      );
      setSelectedShift(
        shiftList.find((shift) => shift.name === data?.shift_id?.name)?.value
      );
    } else {
      setForm({});
      setSelectedTeam("");
      setSelectedShift("");
    }
  }, [team, data, isOpen, isTeam]);

  async function getList() {
    try {
      const res = await getTeams();
      if (res.status === 200) {
        const filteredData = res?.data?.map((ele) => {
          return {
            name: ele?.team_name,
            value: ele?._id,
          };
        });

        setTeamList(filteredData);
        setTeamError(null);
      } else {
        setTeamError("Failed to fetch teams. Please try again.");
      }
    } catch (error) {
      setTeamError("Failed to fetch teams. Please try again.");
    }
  }

  async function getShiftList() {
    try {
      const res = await getShifts();
      if (res.status === 200) {
        const filteredData = res?.data?.map((ele) => {
          return {
            name: ele?.name,
            value: ele?._id,
          };
        });
        setShiftList(filteredData);
        setShiftError(null);
      } else {
        setShiftError("Failed to fetch shifts. Please try again.");
      }
    } catch (error) {
      setShiftError("Failed to fetch shifts. Please try again.");
    }
  }
  useEffect(() => {
    getList();
    getShiftList();
  }, [data, team, teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", form.user_email);
    formData.append("name", form.user_name);
    formData.append("yearly_leaves", form.yearly_leaves);
    formData.append("team_id", selectedTeam);
    formData.append("shift_id", selectedShift);
    formData.append("user_contact", form.user_contact);
    formData.append("user_address", form.user_address);

    try {
      dispatch(showLoader());
      const response = isEdit
        ? await updateUser(formData, form._id)
        : await addUser(formData);
      if (response.status === 200) {
        toast.success("Operation Successfull", {
          autoClose: 2000,
        });
        setSelectedShift("");
        onClose();
        reload();
        reLoad();

        setSelectedTeam("");
      } else {
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
    setForm({});
  };

  const selectedTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const optionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <>
      <Modal
        footer={null}
        className="add-org-modal"
        open={isOpen}
        onOk={onClose}
        onCancel={onClose}
      >
        <div className="Modal-content">
          <h2 className="mb-3">{isEdit ? "Edit User" : "Add User"}</h2>
          <p style={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}>
            {teamError}
          </p>
          <p style={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}>
            {shiftError}
          </p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-3">
              <label htmlFor=""> Name:</label>
              <Input
                size="large"
                type="text"
                required
                value={form?.user_name}
                onChange={(e) => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      user_name: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Email:</label>
              <Input
                size="large"
                type="text"
                required
                value={form.user_email}
                onChange={(e) => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      user_email: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Contact:</label>
              <Input
                size="large"
                type="number"
                required
                value={form.user_contact}
                onChange={(e) => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      user_contact: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Yearly Leaves:</label>
              <Input
                size="large"
                type="number"
                required
                value={form.yearly_leaves}
                onChange={(e) => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      yearly_leaves: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Team:</label>
              <Dropdown
                className="team-dropdown"
                value={selectedTeam}
                onChange={(e) => {
                  const selectedTeam = teamList.find(
                    (team) => team.value === e.value
                  );
                  setSelectedTeam(selectedTeam.value);
                }}
                options={teamList}
                filter
                valueTemplate={selectedTemplate}
                temTemplate={optionTemplate}
                optionLabel="name"
                placeholder=""
                {...(!isEdit ? { required: true } : {})}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="">Shift:</label>
              <Dropdown
                className="team-dropdown"
                value={selectedShift}
                onChange={(e) => {
                  const selectedShift = shiftList.find(
                    (shift) => shift.value === e.value
                  );

                  setSelectedShift(selectedShift?.value);
                }}
                options={shiftList}
                filter
                valueTemplate={selectedTemplate}
                temTemplate={optionTemplate}
                optionLabel="name"
                placeholder=""
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="">Address:</label>
              <Input
                size="large"
                type="text"
                value={form.user_address}
                onChange={(e) => {
                  setForm((prev) => {
                    return {
                      ...prev,
                      user_address: e.target.value,
                    };
                  });
                }}
              />
            </div>

            <div className="mb-3">
              <button type="submit" className="primary-btn w-full">
                {isEdit ? "Save" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
export default AddNewUser;
