// TopBar.js
import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

function TopBar({ collapsed, toggle }) {
  return (
    <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: toggle,
        style: { padding: '0 24px', fontSize: '18px' },
      })} */}
      <span style={{ marginLeft: '20px', fontSize: '18px' }}>응급실 실시간 가용병상정보 조회</span>
    </Header>
  );
}

export default TopBar;
