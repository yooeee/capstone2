import React from "react";
import { Layout } from "antd";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import OLMap from "./OLMap";

function App() {
  return (
    <Layout style={{ height: "100vh" }}>
      {/* 좌측 사이드바 */}
      <SideMenu />

      {/* 우측 레이아웃 */}
      <Layout className="site-layout">
        {/* 헤더에 상단 메뉴바 추가 */}
        <header>
          <TopBar />
        </header>

        {/* 중앙 콘텐츠 영역 */}
        <content style={{ background: "#fff", flex: 1 }}>
          {/* 지도 컴포넌트 */}
          <OLMap />
        </content>
      </Layout>
    </Layout>
  );
}

export default App;
