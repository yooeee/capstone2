import React from "react";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "../../assets/styles/TopBar.css";

const { Header } = Layout;

const TopBar = () => {
  return (
    <Header className="site-layout-background">
      <span className="topbar-title">응급실 실시간 가용병상정보 조회</span>
    </Header>
  );
};

export default TopBar;
