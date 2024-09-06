import React from 'react';
import { Layout, Menu, Select, Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Option } = Select;
const { Search } = Input;

function SideMenu({ collapsed, toggle }) {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
      <div className="logo" style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center' }}>
        LOGO
      </div>
      
      {/* Select 박스 */}
      <div style={{ margin: '16px' }}>
        <Select defaultValue="option1" style={{ width: '100%' }}>
          <Option value="option1">분류</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </div>

      {/* 검색 기능 */}
      <div style={{ margin: '16px' }}>
        <Search
          placeholder="검색어를 입력하세요"
          onSearch={value => console.log(value)}
          enterButton
        />
      </div>

      {/* 메뉴 항목들 */}
     
    </Sider>
  );
}

export default SideMenu;
