import React from "react";
import { Layout, Select, Input } from "antd";
import "../../assets/styles/SideMenu.css";

const { Sider } = Layout;
const { Option } = Select;
const { Search } = Input;

const SideMenu: React.FC = () => {
  return (
    <Sider width={300}>
      <div className="logo">전국 응급의료기관 정보 조회 서비스</div>

      <div className="sidemenu-box"> 
        {/* Select 박스 - 시도 및 시군구 */}
        <div className="sidemenu-admcode">
          <div>
            <Select defaultValue="sido" >
              <Option value="sido">시도 선택</Option>
              {/* 여기에 시도 옵션들을 추가하세요 */}
            </Select>
            <Select defaultValue="sigungu" >
              <Option value="sigungu">시군구 선택</Option>
              {/* 여기에 시군구 옵션들을 추가하세요 */}
            </Select>
          </div>
          
        </div>

        {/* Select 박스 - 분류 */}
        <div className="sidemenu-select-box">
          <Select defaultValue="category" style={{ width: "100%" }}>
            <Option value="category">선택</Option>
            {/* 여기에 분류 옵션들을 추가하세요 */}
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
      </div>


      {/* 검색 결과 */}
      <div className="sidemenu-search-result"></div>

      {/* 사이드바 하단 Footer 추가 */}
      <div className="sidemenu-footer">Copyright © 2024</div>
    </Sider>
  );
};

export default SideMenu;