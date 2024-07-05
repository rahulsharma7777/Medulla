import { Tree, TreeNode } from "react-organizational-chart";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Card } from "antd";
import { GrSubtract } from "react-icons/gr";
import { teamHierarchy } from "../services/Index";

const EmployeesTree = () => {
  const [employeesHierarchy, setEmployeesHierarchy] = useState([]);
  const [transformData, setTransformData] = useState([]);
  const [refrenceData, setRefrenceData] = useState(null);
  const params = useParams();

  const employeesTeamHierarchy = async () => {
    if (params.id) {
      let res = await teamHierarchy(params.id);
      if (res?.data) {
        setEmployeesHierarchy(res?.data);
      }
    }
  };
  const convertData = (employees) => {
    return employees.map((employee) => {
      const subordinates =
        employee.subordinates && convertData(employee.subordinates);
      return {
        ...employee,
        expanded: true,
        subordinates: subordinates,
      };
    });
  };

  const refrenceObj = (employees, obj) => {
    return employees.reduce((acc, employee) => {
      employee.subordinates && refrenceObj(employee.subordinates, obj);
      acc[employee._id] = employee;

      return acc;
    }, obj);
  };
  const handleClick = (e, id) => {
    const updatedTransformData = toggleExpandedState(transformData, id);

    setTransformData(updatedTransformData);
  };

  const toggleExpandedState = (data, id) => {
    return data.map((employee) => {
      if (employee.subordinates.length > 0 && employee._id === id) {
        return {
          ...employee,
          expanded: !employee.expanded,
        };
      } else if (employee.subordinates) {
        return {
          ...employee,
          subordinates: toggleExpandedState(employee.subordinates, id),
        };
      } else {
        return employee;
      }
    });
  };
  useEffect(() => {
    employeesTeamHierarchy();
  }, []);
  useEffect(() => {
    if (employeesHierarchy.length) {
      setTransformData(convertData(employeesHierarchy));
    }
  }, [employeesHierarchy]);
  useEffect(() => {
    setRefrenceData(refrenceObj(transformData, {}));
  }, [transformData]);

  useEffect(() => {}, [refrenceData]);

  const EmployeeCard = ({ data, empId }) => (
    <div
      style={{ display: "flex", justifyContent: "center" }}
      className="emp-card"
    >
      <Card style={{ width: 300, height: 100, padding: "2px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            alt={data?.name}
            src="https://www.w3schools.com/howto/img_avatar.png"
            style={{ margin: "auto", height: 50, width: 50 }}
          />
          <div>
            <p>{data?.name}</p>
            <p>{data?.email}</p>
          </div>
        </div>
        {data.subordinates.length > 0 && (
          <button
            onClick={(e) => handleClick(e, empId)}
            className="emp-card-btn"
          >
            {data.expanded === true ? <GrSubtract /> : data.subordinates.length}
          </button>
        )}
      </Card>
    </div>
  );

  const renderEmployeeTree = (employees) =>
    employees.map((employee) => (
      <TreeNode label={<EmployeeCard data={employee} empId={employee._id} />}>
        {employee.expanded &&
          employee.subordinates &&
          renderEmployeeTree(employee.subordinates)}
      </TreeNode>
    ));

  return (
    <div className="employees-hierarchy">
      {transformData.map((team_lead) => (
        <div key={team_lead._id}>
          <Tree
            lineWidth={"2px"}
            lineColor={"gray"}
            lineBorderRadius={"10px"}
            label={<EmployeeCard data={team_lead} empId={team_lead._id} />}
          >
            {team_lead.expanded &&
              team_lead.subordinates &&
              renderEmployeeTree(team_lead.subordinates)}
          </Tree>
        </div>
      ))}
    </div>
  );
};

export default EmployeesTree;
