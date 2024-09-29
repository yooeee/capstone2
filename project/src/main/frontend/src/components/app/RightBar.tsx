// RightBar.tsx
import React from "react";
import { Drawer } from "antd";
import axios from "axios";

interface RightBarProps {
  visible: boolean;
  onClose: () => void;
  itemData: any | null; // null일 수 있으므로
  urlType: string
}

const RightBar: React.FC<RightBarProps> = ({ visible, onClose, itemData, urlType}) => {
    console.log(itemData);
  
    // try {
    //   const serviceKey =
    //     "Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D";
    //   const params = {
    //     STAGE1: sido,
    //     STAGE2: sigungu,
    //     pageNo: 1,
    //     numOfRows: 999,
    //     QN: name,
    //   };
    //   const response =  axios.get(
    //     `https://apis.data.go.kr/B552657/ErmctInfoInqireService/${urlType}?serviceKey=${serviceKey}`,
    //     { params }
    //   );
    //   const items = response;
      
    // } catch (error) {
    //   console.error("Error fetching the data:", error);
    // }
  
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
