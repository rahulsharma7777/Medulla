import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Spin, Table } from "antd";
import { TbArrowsDoubleSwNe } from "react-icons/tb";
import {
  getUserPartialLeaves,
  getRegularisationHistory,
  getSubadminRegularisationHistory,
  getSudadminPartialHistory,
} from "../services/Index";

const AttendenceRecord = () => {
  const [isData, setIsData] = useState("");
  const [loading, setLoading] = useState(false);
  const [regloading, setRegLoading] = useState(false);
  const [filteredData, setFilteredData] = useState("");
  const [regulariseData, setRegulariseData] = useState("");
  const [filterdRegulariseData, setFilteredRegulariseData] = useState("");
  const location = useLocation();
  const path = location.pathname === "/me/attendence";
  const { id } = useParams();
  const getpartialdata = async () => {
    setLoading(true);
    setRegLoading(true);
    const res = await getUserPartialLeaves();
    const regs = await getRegularisationHistory();
    setIsData(res?.data?.reverse());
    setRegulariseData(regs?.data?.reverse());
  };

  const getSudadminpartialdata = async () => {
    setLoading(true);
    setRegLoading(true);
    const res = await getSudadminPartialHistory(id);

    const regs = await getSubadminRegularisationHistory(id);
    setIsData(res?.data?.reverse());
    setRegulariseData(regs?.data?.reverse());
  };

  useEffect(() => {
    if (path) {
      getpartialdata();
    } else {
      if (id) {
        getSudadminpartialdata();
      }
    }
  }, [id]);
  useEffect(() => {
    if (isData) {
      setFilteredData(transformData(isData));
    }
    if (regulariseData) {
      setFilteredRegulariseData(transformData(regulariseData));
    }
  }, [isData, regulariseData]);

  const columns2 = [
    {
      title: "DATE",
      dataIndex: "DATE",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {text}{" "}
          <TbArrowsDoubleSwNe style={{ fontSize: "20px", color: "#1677ff" }} />
        </div>
      ),
    },
    {
      title: "REQUEST TYPE",
      dataIndex: "REQUEST_TYPE",
    },
    {
      title: "REQUEST TIME",
      dataIndex: "REQUEST_TIME",
    },
    {
      title: "REQUESTED ON",
      dataIndex: "REQUESTED_ON",
    },
    {
      title: "NOTE",
      dataIndex: "NOTE",
      render: (text) => <div style={{ padding: "15px 0px 5px" }}>{text}</div>,
    },
    { title: "STATUS", dataIndex: "STATUS" },
    { title: "ACTION BY", dataIndex: "ACTION_BY" },
    {
      title: "REASON",
      dataIndex: "REASON",
    },
  ];
  const columns1 = [
    {
      title: "DATE",
      dataIndex: "DATE",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {text}{" "}
          <TbArrowsDoubleSwNe style={{ fontSize: "20px", color: "#1677ff" }} />
        </div>
      ),
    },

    {
      title: "REQUESTED ON",
      dataIndex: "REQUESTED_ON",
    },

    {
      title: "NOTE",
      dataIndex: "NOTE",
      render: (text) => <div style={{ padding: "15px 0px 5px" }}>{text}</div>,
    },
    { title: "STATUS", dataIndex: "STATUS" },

    { title: "ACTION BY", dataIndex: "ACTION_BY" },
    {
      title: "REASON",
      dataIndex: "REASON",
    },
  ];
  const transformData = (leaves) => {
    const transformedData = leaves?.map((item) => {
      const date = new Date(item?.date);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
      let formattedRequestedOnDate;
      if (item?.createdAt) {
        const requestedOnDate = new Date(item?.createdAt);
        formattedRequestedOnDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(requestedOnDate);
      }
      let requestType;
      switch (item?.type) {
        case 1:
          requestType = "Early Leaving";
          break;
        case 2:
          requestType = "Intervening";
          break;
        case 3:
          requestType = "Coming Late";
          break;
        default:
          requestType = "Unknown";
      }
      let status;
      switch (item?.status) {
        case 0:
          status = "Pending";
          break;
        case 1:
          status = "Approved";
          break;
        case 2:
          status = "Rejected";
          break;
        default:
          status = "Unknown";
      }
      let note;
      if (item?.reason) {
        note = item?.reason;
      } else {
        note = item?.note;
      }

      return {
        key: item._id,
        DATE: formattedDate,
        REQUEST_TYPE: requestType,
        REQUESTED_ON: formattedRequestedOnDate,
        REQUEST_MINUTE: item.minutes,
        NOTE: note,
        STATUS: status,
        ACTION_BY: item?.actionBy?.user_name,
        REASON: item.actionReason,
        REQUEST_TIME: item.minutes,
      };
    });
    setRegLoading(false);
    setLoading(false);
    return transformedData;
  };
  columns1[1].width = 180;
  columns2[5].width = 130;
  columns2[4].width = 250;
  columns2[3].width = 180;
  columns2[2].width = 100;
  columns2[7].width = 400;
  columns2[1].width = 150;
  columns2[0].width = 200;
  const currentDate = new Date();
  const thirtyDaysBeforeDate = new Date(currentDate);
  thirtyDaysBeforeDate.setDate(thirtyDaysBeforeDate.getDate() - 30);
  const formattedCurrentDate = currentDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedThirtyDaysBeforeDate = thirtyDaysBeforeDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
  return (
    <div>
      <div className="partial-day-requests">
        <div className="main-heading">
          <h3>Partial Day Requests</h3>
          <h3>
            {formattedCurrentDate}-{formattedThirtyDaysBeforeDate}
          </h3>
        </div>
        <Spin spinning={loading}>
          <Table
            columns={columns2}
            dataSource={filteredData}
            bordered={true}
            pagination={{ pageSize: 4 }}
          />
        </Spin>
      </div>
      <div className="attendence-regularisation-requests">
        <div className="main-heading">
          <h3>Regularization Requests</h3>
          <h3>
            {formattedCurrentDate}-{formattedThirtyDaysBeforeDate}
          </h3>
        </div>
        <div className="heading-content">
          <Spin spinning={regloading}>
            <Table
              columns={columns1}
              dataSource={filterdRegulariseData}
              bordered={true}
              pagination={{ pageSize: 4 }}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
};
export default AttendenceRecord;
