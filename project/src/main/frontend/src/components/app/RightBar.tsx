// RightBar.tsx
import React from "react";
import { Drawer } from "antd";

interface RightBarProps {
  visible: boolean;
  onClose: () => void;
  itemData: any | null; // null일 수 있으므로
}

const RightBar: React.FC<RightBarProps> = ({ visible, onClose, itemData }) => {
  return (
    <Drawer
      title="Marker 정보"
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      {itemData ? (
        <div>
          <h3>{itemData.dutyName}</h3>
          <p>Longitude: {itemData.wgs84Lon}</p>
          <p>Latitude: {itemData.wgs84Lat}</p>
          {/* 추가 정보 표시 */}
        </div>
      ) : (
        <p>마커 정보를 선택해주세요.</p>
      )}
    </Drawer>
  );
};

export default RightBar;
