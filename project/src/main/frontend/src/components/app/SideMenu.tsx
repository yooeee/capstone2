import React from "react";
import { Layout, Select, Input } from "antd";
import "../../assets/styles/SideMenu.css";

const { Sider } = Layout;
const { Option } = Select;
const { Search } = Input;

const SideMenu: React.FC = () => {
  return (
    <Sider width={280}>
      <div className="logo">전국 응급의료기관 정보 조회 서비스</div>

      {/* Select 박스 */}
      <div className="sidemenu-select-box">
        <Select defaultValue="option1" style={{ width: "100%" }}>
          <Option value="option1">분류</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </div>

      {/* 검색 기능 */}
      <div className="sidemenu-search-box">
        <Search
          placeholder="검색어를 입력하세요"
          onSearch={(value) => console.log(value)}
          enterButton
        />
      </div>

      {/* 사이드바 하단 Footer 추가 */}
      <div className="sidemenu-footer">Copyright © 2024</div>
    </Sider>
  );
};

export default SideMenu;