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
    console.log(itemData);
    useEffect(() => {
        const fetchDetailedData = async () => {
            try {
                const serviceKey = "Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D";
                const { sidoData, sigunguData } = extractSidoSigungu(itemData.dutyAddr);
                const params = {
                    STAGE1: sidoData,
                    STAGE2: sigunguData,
                    pageNo: 1,
                    numOfRows: 999,
                };
                const response = await axios.get(
                    `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=${serviceKey}`,
                    { params }
                );
                // 응답에서 item 배열 가져오기
                const items = response.data.response.body.items.item;
                if(items.length < 1){
                    alert("해당 병원의 실시간 응급실 정보가 존재하지 않습니다.");
                } else if(items.length == 0) {
                    if (items.hpid === itemData.hpid) {
                        setDetailedData(items);
                    } else{
                        alert("해당 병원의 실시간 응급실 정보가 존재하지 않습니다.");
                    }
                } else {
                    for (const item of items) {
                        if (item.hpid === itemData.hpid) {
                            console.log("상세값:");
                            console.log(item);
                            setDetailedData(item);
                            break;
                        }
                    }
                }
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
        { title: '가용/전체(수)', dataIndex: 'value', key: 'value' },
    ];

    const data = [
        { key: '1', name: '[중환자실] 내과', value: displayData?.hv2 },
        { key: '2', name: '[중환자실] 외과', value: displayData?.hv3 },
        { key: '3', name: '외과입원실(정형외과)', value: displayData?.hv4 },
        { key: '4', name: '신경과입원실', value: displayData?.hv5 },
        { key: '5', name: '[중환자실] 신경외과', value: displayData?.hv6 },
        { key: '6', name: '약물중환자', value: displayData?.hv7 },
        { key: '7', name: '[중환자실] 화상', value: displayData?.hv8 },
        { key: '8', name: '[중환자실] 외상', value: displayData?.hv9 },
        { key: '9', name: 'VENTI(소아)', value: displayData?.hv10 },
        { key: '10', name: '인큐베이터(보육기)', value: displayData?.hv11 },
        { key: '11', name: '소아당직의 직통연락처', value: displayData?.hv12 },
        { key: '12', name: '격리진료구역 음압격리병상', value: displayData?.hv13 },
        { key: '13', name: '격리진료구역 일반격리병상', value: displayData?.hv14 },
        { key: '14', name: '소아음압격리', value: displayData?.hv15 },
        { key: '15', name: '소아일반격리', value: displayData?.hv16 },
        { key: '16', name: '[응급전용] 중환자실 음압격리', value: displayData?.hv17 },
        { key: '17', name: '[응급전용] 중환자실 일반격리', value: displayData?.hv18 },
        { key: '18', name: '[응급전용] 입원실 음압격리', value: displayData?.hv19 },
        { key: '19', name: '[응급전용] 입원실 일반격리', value: displayData?.hv21 },
        { key: '20', name: '감염병 전담병상 중환자실', value: displayData?.hv22 },
        { key: '21', name: '감염병 전담병상 중환자실 내 음압격리병상', value: displayData?.hv23 },
        { key: '22', name: '[감염] 중증 병상', value: displayData?.hv24 },
        { key: '23', name: '[감염] 준-중증 병상', value: displayData?.hv25 },
        { key: '24', name: '[감염] 중등증 병상', value: displayData?.hv26 },
        { key: '25', name: '코호트 격리', value: displayData?.hv27 },
        { key: '26', name: '소아', value: displayData?.hv28 },
        { key: '27', name: '응급실 음압 격리 병상', value: displayData?.hv29 },
        { key: '28', name: '응급실 일반 격리 병상', value: displayData?.hv30 },
        { key: '29', name: '[응급전용] 중환자실', value: displayData?.hv31 },
        { key: '30', name: '[중환자실] 소아', value: displayData?.hv32 },
        { key: '31', name: '[응급전용] 소아중환자실', value: displayData?.hv33 },
        { key: '32', name: '[중환자실] 심장내과', value: displayData?.hv34 },
        { key: '33', name: '[중환자실] 음압격리', value: displayData?.hv35 },
        { key: '34', name: '[응급전용] 입원실', value: displayData?.hv36 },
        { key: '35', name: '[응급전용] 소아입원실', value: displayData?.hv37 },
        { key: '36', name: '[입원실] 외상전용', value: displayData?.hv38 },
        { key: '37', name: '[기타] 외상전용 수술실', value: displayData?.hv39 },
        { key: '38', name: '[입원실] 정신과 폐쇄병동', value: displayData?.hv40 },
        { key: '39', name: '[입원실] 음압격리', value: displayData?.hv41 },
        { key: '40', name: '[기타] 분만실', value: displayData?.hv42 },
        { key: '41', name: '[기타] 화상전용처치실', value: displayData?.hv43 }
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
                        <p>주소: {itemData?.dutyAddr}</p>
                    </div>
                    <div className="info-item">
                        <PhoneOutlined className="icon" />
                        <p>응급실: {itemData?.dutyTel3}</p>
                    </div>
                    <div className="info-item">
                        <MedicineBoxOutlined className="icon" />
                        <p>당직의: {displayData?.hv1}</p>
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
                        <p>업데이트 시간: {displayData?.hvidate}</p>
                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} />
                </div>
            </div>
        </Modal>
    );
};

function extractSidoSigungu(dutyAddr: string): { sidoData: string, sigunguData: string } {
    const addrParts = dutyAddr.split(' ');

    // 첫 번째 값이 시도, 두 번째 값이 시군구
    const sidoData: string = addrParts[0];
    const sigunguData: string = addrParts[1];

    return { sidoData, sigunguData };
}


export default ModalComponent;