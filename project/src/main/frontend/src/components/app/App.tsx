import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import SideMenu from "./SideMenu.tsx";
import OLMap from "./OLMap.tsx";
import axios from "axios";

const { Content } = Layout;

const App: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]); // 위치 데이터를 저장할 상태

  // 위치 데이터를 설정하는 함수
  const updateLocations = (data: any[]) => {
    setLocations(data);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* 좌측 사이드바 */}
      <SideMenu updateLocations={updateLocations} />

      {/* 우측 레이아웃 */}
      <Layout className="site-layout">
        <Content style={{ background: "#fff", flex: 1 }}>
          {/* 지도 컴포넌트 */}
          <OLMap locations={locations} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
