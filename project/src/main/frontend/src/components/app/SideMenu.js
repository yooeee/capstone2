// SideMenu.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function SideMenu({ collapsed, toggle }) {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center' }}>
        LOGO
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        {/* 추가 메뉴 항목들 */}
        <Menu.Item key="2">Menu Item 2</Menu.Item>
        <Menu.Item key="3">Menu Item 3</Menu.Item>
      </Menu>
    </Sider>
  );
}

export default SideMenu;
