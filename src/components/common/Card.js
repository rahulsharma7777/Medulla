import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../Assests/Images/delete.png";
import editIcon from "../../Assests/Images/edit.png";
import { toast } from "react-toastify";
import { Modal, Button } from "antd";
import { editMode, loadMode } from "../../redux/slice/editmodeSlice";
import { deleteNewOrg } from "../../services/Index";
import AddNewOrg from "../AddNewOrg";

const CardItem = ({ Items }) => {
  const [isOpen, setIsOpen] = useState("");
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const isEdit = useSelector((state) => state.editMode.isEdit);
  const dispatch = useDispatch();

  const handleEdit = (item) => {
    setData(item);
    setIsOpen(true);
  };
  const handleClick = (id) => {
    if (!isEdit) {
      navigate(`/organization/${id}`);
    }
  };
  const handleDelete = async (id) => {
    const res = await deleteNewOrg(id);
    if (res.status === 200) {
      dispatch(editMode());
      dispatch(loadMode());
      toast.success("Deleted Successfully");
    } else {
      toast.error("There is a error");
    }
  };
  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm",
      content: "Are you sure you want to delete this organisation?",
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <Button
            type="primary"
            danger
            onClick={async () => {
              await handleDelete(id);
              Modal.destroyAll();
            }}
          >
            Delete
          </Button>
          <CancelBtn />
        </>
      ),
    });
  };

  const renderCardWithIcons = (item) => (
    <navigate className="card-main" onClick={() => handleClick(item._id)}>
      <div className="card" key={item.id} bordered={false}>
        <div className="card-image">
          <img
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            alt="logo"
          />

          <strong></strong>
        </div>
        <div className="card-details">
          <h2 className="title">{item.org_name}</h2>
          <p className="email">
            <strong>Email:</strong> {item.org_email}
          </p>
          <p className="location">
            <strong>Location:</strong> {item.org_location}
          </p>
          <p className="contact">
            <strong>Contact:</strong> {item.org_contact}
          </p>
          {isEdit && (
            <div className="card-btn">
              <img
                className="delete"
                src={editIcon}
                alt="delete"
                onClick={() => handleEdit(item)}
              />
              <img
                className="delete"
                src={deleteIcon}
                alt="delete"
                onClick={() => confirmDelete(item._id)}
              />
            </div>
          )}
        </div>
      </div>
    </navigate>
  );

  return (
    <div className="card-container">
      {Items?.map((item) => renderCardWithIcons(item))}
      <div className="add-org-container">
        <AddNewOrg
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          orgData={data}
        />
      </div>
    </div>
  );
};

export default CardItem;
