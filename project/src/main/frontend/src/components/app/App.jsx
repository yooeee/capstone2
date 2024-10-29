// App.jsx
import React, { useState } from "react";
import { Layout } from "antd";
import SideMenu from "./SideMenu";
import OLMap from "./OLMap";
import ModalComponent from "./ModalComponent";

const { Content } = Layout;

const App = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [rightBarVisible, setRightBarVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [urlType, setUrlType] = useState("");
  const [myLocation2, setMyLocation2] = useState(null);
  
  // 추가: 병원 위치 정보를 저장할 상태
  const [hospitalLocation, setHospitalLocation] = useState(null);

  const updateLocations = (data, urlType) => {
    setSearchResult(data);
    setUrlType(urlType);
  };

  const handleItemSelect = (item, urlType) => {
    setSelectedItem(item);
    setRightBarVisible(true);
    setUrlType(urlType);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <SideMenu
        updateLocations={updateLocations}
        myLocation2={myLocation2}
        // 추가: 병원 위치 업데이트 함수를 전달
        setHospitalLocation={setHospitalLocation}
      />
      <Layout className="site-layout">
        <Content style={{ background: "#fff", flex: 1 }}>
          <OLMap
            searchResult={searchResult}
            onItemSelect={handleItemSelect}
            urlType={urlType}
            setMyLocation2={setMyLocation2}
            // 추가: 병원 위치 정보를 전달
            hospitalLocation={hospitalLocation}
          />
        </Content>
      </Layout>
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
