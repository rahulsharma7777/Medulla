import React from "react";
import { Table } from "antd";
import { useState, useEffect } from "react";
import {useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrgById } from "../services/Index";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import AddNewSubadmin from "../components/AddNewSubadmin";
const columns = [
  {
    title: "Name",
    dataIndex: "user_name",
    _id: "name",
    render: (text, record) => {
      return text || "NA";
    },
  },
  {
    title: "Email",
    dataIndex: "user_email",
    _id: "Email",
    render: (text, record) => {
      return text || "NA";
    },
  },
  {
    title: "Contact",
    dataIndex: "user_contact",
    _id: "Contact",
    render: (text, record) => {
      return text || "NA";
    },
  },
  {
    title: "Address",
    dataIndex: "user_address",
    _id: "Address",
    render: (text, record) => {
      return text || "NA";
    },
  },
];
const colums2 = [
  {
    title: "Name",
    dataIndex: "user_name",
    _id: "name",
    render: (text, record) => {
      return text || "NA";
    },
  },
  {
    title: "Email",
    dataIndex: "user_email",
    _id: "Email",
  },
  {
    title: "Team",
    dataIndex: "team_id",
    _id: "Team",
    render: (item) => {
      if (item) {
        return item.team_name;
      } else {
        return "NA";
      }
    },
  },
  {
    title: "Address",
    dataIndex: "user_address",
    _id: "Address",
    render: (text, record) => {
      return text || "NA";
    },
  },
];

const SubadminDetail = () => {
  const [item, setItem] = useState();
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setIsReload] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  async function fetchorg(id) {
    try {
      dispatch(showLoader());
      const res = await getOrgById(id);
      setItem(res?.data);

      setData(res?.data?.sub_admins);
      setUserData(res?.data?.employees);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
  useEffect(() => {
    fetchorg(id);
  }, [reload]);
  const handleClick = () => {
    setIsOpen(() => true);
  };

  return (
    <>
      <div className="subadmin-btn">
        <button
          type="button"
          className={`primary-btn mr-3 ${isOpen ? "active" : ""}`}
          onClick={handleClick}
        >
          Add Subadmin
        </button>
      </div>
      <div className="detailed-card">
        <div className="card-main">
          <div className="card" key={item?._id} bordered={false}>
            <div className="card-image">
              <img src={item?.org_detail[0]?.org_img} alt="logo" />
              <strong></strong>
            </div>
            <div className="card-details">
              <h2 className="title">{item?.org_detail[0]?.org_name}</h2>
              <p className="email">
                <strong>Email:</strong> {item?.org_detail[0]?.org_email}
              </p>
              <p className="no-of-emp">
                <strong>No of employees:</strong> {item?.No_of_emp}
              </p>
              <p className="location">
                <strong>Location:</strong> {item?.org_detail[0]?.org_location}
              </p>
              <p className="contact">
                <strong>Contact:</strong> {item?.org_detail[0]?.org_contact}
              </p>
              <p className="ipaddress">
                <strong>Ip Address</strong> {item?.org_detail[0]?.org_ip}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AddNewSubadmin
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        setIsReload={() => setIsReload(true)}
        setItem={setItem}
        Id={id}
      />
      <section className="subadmin-table">
        <h2>SUB-ADMINS</h2>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1300 }}
          pagination={false}
          bordered={true}
        />
      </section>
      <section className="users-table">
        <h2>USERS</h2>
        <Table
          columns={colums2}
          dataSource={userData}
          scroll={{ x: 1300 }}
          pagination={false}
          bordered={true}
        />
      </section>
    </>
  );
};
export default SubadminDetail;
