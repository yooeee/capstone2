// App.jsx
import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import SideMenu from "./SideMenu";
import OLMap from "./OLMap";
import axios from "axios";
import ModalComponent from "./ModalComponent";

const { Content } = Layout;

const App = () => {
  const [searchResult, setSearchResult] = useState([]); // 위치 데이터를 저장할 상태
  const [rightBarVisible, setRightBarVisible] = useState(false); // RightBar 상태 관리
  const [selectedItem, setSelectedItem] = useState(null); // 클릭한 마커의 정보
  const [urlType, setUrlType] = useState(""); // urlType 상태 추가
  

  // 위치 데이터를 설정하는 함수
  const updateLocations = (data, urlType) => {
    setSearchResult(data);
    setUrlType(urlType); 
  };

  // RightBar의 정보를 업데이트하는 함수
  const handleItemSelect = (item, urlType) => {
    setSelectedItem(item);
    setRightBarVisible(true);
    setUrlType(urlType); // 선택된 아이템의 urlType 설정
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* 좌측 사이드바 */}
      <SideMenu updateLocations={updateLocations} />

      {/* 우측 레이아웃 */}
      <Layout className="site-layout">
        <Content style={{ background: "#fff", flex: 1 }}>
          {/* 지도 컴포넌트 */}
          <OLMap searchResult={searchResult} onItemSelect={handleItemSelect} urlType={urlType} />
        </Content>
      </Layout>

      {/* RightBar 컴포넌트 */}
      <ModalComponent
        visible={rightBarVisible}
        onClose={() => setRightBarVisible(false)}
        itemData={selectedItem}
        urlType={urlType}
      />
    </Layout>
  );
};

export default App;
