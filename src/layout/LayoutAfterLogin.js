import React, { useState, useEffect } from "react";
import { Badge } from "antd";
import { googleLogout } from "@react-oauth/google";
import { MdForwardToInbox } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  IdcardOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getNotifications } from "../services/Index";
import MedullaLogo from "../Assests/Images/MedullaLogo.png";
import {
  updateNotications,
  updateCountOfNotications,
  updateLeavesCount,
  updatePartialCount,
  updateRegCount,
} from "../redux/slice/notificationsSlice.js";
import { clearShiftDetails } from "../redux/slice/shiftSlice.js";
const { Header, Sider } = Layout;

const LayoutAfterLogin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasNotifications = useSelector(
    (state) => state.notification.hasNotifications
  );
  const countOfInboxNotifications = useSelector(
    (state) => state.notification.countOfInboxNotifications
  );
  const countOfLeavesNotifications = useSelector(
    (state) => state.notification.countOfLeavesNotifications
  );
  const hasLeavesNotifications = useSelector(
    (state) => state.notification.hasLeavesNotifications
  );
  const hasPartialNotifications = useSelector(
    (state) => state.notification.hasPartialNotifications
  );
  const hasRegNotifications = useSelector(
    (state) => state.notification.hasRegNotifications
  );
  const countOfRegNotifications = useSelector(
    (state) => state.notification.countOfRegNotifications
  );
  const countOfPartialNotifications = useSelector(
    (state) => state.notification.countOfPartialNotifications
  );
  const getRole = () => {
    const user = localStorage.getItem("ROLE");
    setRole(user);
    const profile_img = localStorage.getItem("PROFILE-IMG");
    setProfile(profile_img);
  };
  useEffect(() => {
    getRole();
    userNotifications();
  }, []);
  const userNotifications = async () => {
    const res = await getNotifications();
    if (res?.data?.length) {
      dispatch(updateNotications(true));
      dispatch(updateCountOfNotications(res?.data?.length));

      let leavesCount = 0;
      let partialCount = 0;
      let regCount = 0;
      res.data.forEach((notification) => {
        switch (notification.notification_type) {
          case 1:
            leavesCount++;
            break;
          case 3:
            regCount++;
            break;
          case 2:
            partialCount++;
            break;
          default:
            break;
        }
      });
      dispatch(updateLeavesCount(leavesCount));
      dispatch(updatePartialCount(partialCount));
      dispatch(updateRegCount(regCount));
    } else {
      dispatch(updateNotications(false));
    }
  };

  const getItem = (label, key, icon, path, children) => {
    return {
      key,
      icon,
      children,
      label,
      path,
    };
  };

  const onHandleLogout = () => {
    dispatch(clearShiftDetails());
    localStorage.clear("TOKEN");
    localStorage.clear("ROLE");
    googleLogout();
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">My Profile</Menu.Item>
      <Menu.Item key="password">Change Password</Menu.Item>
      <Menu.Item onClick={() => onHandleLogout()} key="logout">
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    switch (e.key) {
      case "12":
        navigate("/manage-users");
        break;
      case "13":
        navigate("/manage-teams");
        break;
      case "4":
        navigate("/me/attendence");
        break;
      case "14":
        navigate("/manage-attendence");
        break;
      case "3":
        navigate("/me/leaves");
        break;
      case "19":
        navigate("/user-inbox/partial-day");
        break;
      case "17":
        navigate("/user-inbox/Leave-Requests");
        break;
      case "18":
        navigate("/user-inbox/attendence-regularization");
        break;
      case "20":
        navigate("/manage-shifts");
        break;
      default:
        navigate("/subadmin-dashboard");
    }
  };

  const renderIcon = (active, hasNotifications, countOfNotifications) => {
    if (hasNotifications) {
      return (
        <Badge
          count={countOfNotifications}
          size="small"
          style={{ backgroundColor: "#ff4d4f" }}
        >
          {active === 0 ? (
            <MdForwardToInbox style={{ fontSize: "20px" }} />
          ) : null}
          {active === 1 ? (
            <MdOutlinePendingActions style={{ fontSize: "20px" }} />
          ) : null}
          {active === 2 ? (
            <IoMdNotifications style={{ fontSize: "20px" }} />
          ) : null}
          {active === 3 ? (
            <HiOutlineArchiveBox style={{ fontSize: "20px" }} />
          ) : null}
        </Badge>
      );
    } else {
      switch (active) {
        case 0:
          return <MdForwardToInbox style={{ fontSize: "20px" }} />;
        case 1:
          return <MdOutlinePendingActions />;
        case 2:
          return <IoMdNotifications />;
        case 3:
          return <HiOutlineArchiveBox />;
        default:
          return null;
      }
    }
  };
  const items = [
    getItem("Home", "1", <HomeOutlined />),
    getItem("Me", "2", <UserOutlined />, "", [
      getItem("Leave", "3", <ScheduleOutlined />, "/me/leaves"),
      getItem("Attendance", "4", <IdcardOutlined />, "/me/attendence"),
    ]),
    getItem(
      "Inbox",
      "15",
      renderIcon(0, hasNotifications, countOfInboxNotifications),
      "",
      [
        getItem(
          "Leave Request",
          "17",
          renderIcon(1, hasLeavesNotifications, countOfLeavesNotifications),

          "/user-inbox/Leave-Requests"
        ),
        getItem(
          "Attendence Regularization",
          "18",
          renderIcon(3, hasRegNotifications, countOfRegNotifications),

          "/user-inbox/attendence-regularization"
        ),
        getItem(
          "Partial Day",
          "19",
          renderIcon(2, hasPartialNotifications, countOfPartialNotifications),
          "/user-inbox/partial-day"
        ),
      ]
    ),
  ];
  if (role === "1") {
    items.push(
      getItem("Manage", "sub3", <TeamOutlined />, "", [
        getItem("Manage Users", "12", <TeamOutlined />, "/manage-users"),
        getItem("Manage Teams", "13", <TeamOutlined />, "/manage-teams"),
        getItem(
          "Manage Attendence",
          "14",
          <IdcardOutlined />,

          "/manage-attendence"
        ),

        getItem(
          "Manage Shifts",
          "20",
          <AppstoreOutlined />,

          "/manage-shifts"
        ),
      ])
    );
  }

  useEffect(() => {
    const findMenuItem = (items, pathname) => {
      for (const item of items) {
        if (item.path === pathname) {
          return item;
        } else if (item.children) {
          const childItem = findMenuItem(item.children, pathname);
          if (childItem) {
            return childItem;
          }
        }
      }
      return null;
    };

    const menuItem = findMenuItem(items, location.pathname);
    if (menuItem) {
      setSelectedMenuItem(menuItem.key);
    }
  }, [location.pathname, selectedMenuItem]);

  return (
    <Layout className="medulla-layout">
      <Header className="medulla-header">
        <img className="dashboard-logo" src={MedullaLogo} alt="err" />

        <Dropdown overlay={menu} className="profile-dropdown">
          <div>
            <span className="profile-text">Profile</span>
            <Avatar size="medium" src={profile} icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="sider-logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["3"]}
            selectedKeys={[selectedMenuItem]}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout className="right-side-main">
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutAfterLogin;
