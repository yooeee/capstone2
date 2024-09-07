import React from "react";
import { Layout, Select, Input, List, Avatar } from "antd";
import "../../assets/styles/SideMenu.css";

const { Sider } = Layout;
const { Option } = Select;
const { Search } = Input;

const SideMenu = () => {

  // 임시 데이터
  const data = [
    {
      title: "서울대학교병원 응급실",
      description: "서울특별시 종로구",
      icon: "https://cdn-icons-png.flaticon.com/512/3022/3022645.png", // 임시 아이콘 URL
    },
    {
      title: "연세대학교 세브란스병원",
      description: "서울특별시 서대문구",
      icon: "https://cdn-icons-png.flaticon.com/512/3022/3022645.png", // 임시 아이콘 URL
    },
  ];


  return (
    <Sider width={300}>
      <div className="sidemenu">


        <div className="logo">전국 응급의료기관 정보 조회 서비스</div>

        <div className="sidemenu-box">
          {/* Select 박스 */}
          <div className="sidemenu-select-box">
            <Select defaultValue="조회 분류" style={{ width: "100%" }}>
              <Option value="1">응급실 실시간 가용병상정보 조회</Option>
              <Option value="2">중증질환자 수용가능정보 조회</Option>
              <Option value="3">응급의료기관 목록정보 조회</Option>
              <Option value="4">응급의료기관 위치정보 조회</Option>
            </Select>
          </div>

          {/* 검색 기능 */}
          <div className="sidemenu-search-box">
            <Select className="select" defaultValue="시도" style={{ width: "100%" }}>
            </Select>
            <Select className="select" defaultValue="시군구" style={{ width: "100%" }}>
            </Select>
          </div>

          <div className="sidemenu-search-box">
            <Search
              placeholder="기관명을 입력하세요"
              enterButton
            ></Search>
          </div>

        </div>

        
          {/* 검색 결과 리스트 */}
          <div className="result-list">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.icon} />}
                    title={<a href="https://hospital.example.com">{item.title}</a>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </div>


        {/* 사이드바 하단 Footer 추가 */}
        <div className="sidemenu-footer">Copyright © 2024</div>
      </div>
    </Sider>
  );
};

export default SideMenu;
