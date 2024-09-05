import React from 'react';
import { Layout } from 'antd';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import OLMap from './OLMap';

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = React.useState(false);

  // 사이드바 접기/펴기 핸들러
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 좌측 사이드바 */}
      <SideMenu collapsed={collapsed} toggle={toggle} />

      {/* 우측 컨텐츠 */}
      <Layout className="site-layout">
        {/* 상단 메뉴바 */}
        <TopBar collapsed={collapsed} toggle={toggle} />

        {/* 중앙 및 우측 지도 영역 */}
        <Content style={{ background: '#fff' }}>
          {/* 지도 컴포넌트 */}
          <OLMap />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
