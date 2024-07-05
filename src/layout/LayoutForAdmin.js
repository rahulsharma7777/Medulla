import React from "react";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";
import { Layout, Menu, Avatar, theme, Dropdown } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import MedullaLogo from "../Assests/Images/MedullaLogo.png";
const { Header, Sider } = Layout;

export const LayoutForAdmin = () => {
  const navigate = useNavigate();
  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const onHandleLogout = () => {
    localStorage.clear("ADMIN_TOKEN");
    navigate("/admin-login");
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => onHandleLogout()} key="logout">
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      navigate("/admin-dashboard");
    }
  };

  const items2 = [getItem("Org", "1", <ShopOutlined />)];

  return (
    <div>
      <Layout className="layout-container">
        <Header className="medulla-header">
          <i mg className="dashboard-logo" src={MedullaLogo} alt="err" />
          <Dropdown overlay={menu} className="profile-dropdown">
            <div>
              <span className="profile-text">Profile</span>
              <Avatar size="small" icon={<UserOutlined sty />} />
            </div>
          </Dropdown>
        </Header>
        <Layout>
          <Sider collapsible collapsed={true} className="sidebar-container">
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items2}
              onClick={handleMenuClick}
              className="sidebar-menu-list"
            />
          </Sider>
          <Layout style={{ padding: "30px" }}>
            <Outlet />
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};
