import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table } from "antd";
import { PhoneOutlined, EnvironmentOutlined, MedicineBoxOutlined, NumberOutlined } from '@ant-design/icons';
import "../../assets/styles/ModalComponent.css";

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
  itemData: any | null;
  urlType: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ visible, onClose, itemData, urlType }) => {
  const [detailedData, setDetailedData] = useState<any>(null);

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        const serviceKey = "Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D";
        const params = {
          STAGE1: '서울특별시',
          STAGE2: '강남구',
          pageNo: 1,
          numOfRows: 999,
        };
        const response = await axios.get(
          `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=${serviceKey}`,
          { params }
        );
        setDetailedData(response.data.response.body.items.item[0]);
        console.log(response.data.response.body.items.item[0])
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    if (visible && itemData) {
      fetchDetailedData();
    }
  }, [visible, itemData, urlType]);

  const displayData = detailedData || itemData;

  const columns = [
    { title: '구분', dataIndex: 'name', key: 'name' },
    { title: '수', dataIndex: 'value', key: 'value' },
  ];

  const data = [
    { key: '1', name: '응급실', value: displayData?.hvec },
    { key: '2', name: '수술실', value: displayData?.hvoc },
    { key: '3', name: '신경중환자실', value: displayData?.hvcc },
    { key: '4', name: '신생중환자실', value: displayData?.hvncc },
    { key: '5', name: '흉부중환자실', value: displayData?.hvccc },
    { key: '6', name: '일반중환자실', value: displayData?.hvicc },
    { key: '7', name: '입원실', value: displayData?.hvgc },
    { key: '8', name: '내과중환자실', value: displayData?.hv2 },
    { key: '9', name: '외과중환자실', value: displayData?.hv3 },
    { key: '10', name: '신경과입원실', value: displayData?.hv5 },
    { key: '11', name: '신경외과중환자실', value: displayData?.hv6 },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={600}
      className="hospital-modal"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>{displayData?.dutyName}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="info-item">
            <EnvironmentOutlined className="icon" />
            <p>{displayData?.dutyAddr}</p>
          </div>
          <div className="info-item">
            <PhoneOutlined className="icon" />
            <p>응급실: {displayData?.dutyTel3}</p>
          </div>
          <div className="info-item">
            <MedicineBoxOutlined className="icon" />
            <p>당직의: {displayData?.hvdnm}</p>
          </div>
          <div className="info-item">
            <NumberOutlined className="icon" />
            <p>ID: {displayData?.hpid}</p>
          </div>
          <div className="info-item">
            <p>CT 가용: {displayData?.hvctayn === 'Y' ? '가능' : '불가능'}</p>
            <p>MRI 가용: {displayData?.hvmriayn === 'Y' ? '가능' : '불가능'}</p>
            <p>조영촬영기 가용: {displayData?.hvangioayn === 'Y' ? '가능' : '불가능'}</p>
            <p>인공호흡기 가용: {displayData?.hvventiayn === 'Y' ? '가능' : '불가능'}</p>
            <p>구급차 가용: {displayData?.hvamyn === 'Y' ? '가능' : '불가능'}</p>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;