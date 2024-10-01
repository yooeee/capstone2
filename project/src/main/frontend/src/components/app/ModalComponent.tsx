import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table, Descriptions, Badge } from "antd";
import { PhoneOutlined, EnvironmentOutlined, MedicineBoxOutlined, NumberOutlined, ClockCircleTwoTone } from '@ant-design/icons';
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
                if (items.length < 1) {
                    alert("해당 병원의 실시간 응급실 정보가 존재하지 않습니다.");
                } else if (items.length == 0) {
                    if (items.hpid === itemData.hpid) {
                        setDetailedData(items);
                    } else {
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

    const columns1 = [
        { title: '응급실', dataIndex: 'name', key: 'name' },
        { title: '가용/전체(수)', dataIndex: 'value', key: 'value' },
    ];
    const columns2 = [
        { title: '응급전용', dataIndex: 'name', key: 'name' },
        { title: '가용/전체(수)', dataIndex: 'value', key: 'value' },
    ];
    const columns3 = [
        { title: '중환자실', dataIndex: 'name', key: 'name' },
        { title: '가용/전체(수)', dataIndex: 'value', key: 'value' },
    ];
    const columns4 = [
        { title: '기타', dataIndex: 'name', key: 'name' },
        { title: '가용/전체(수)', dataIndex: 'value', key: 'value' },
    ];
    const data1 = [
        // 응급실
        { key: '1', name: '[응급실] 일반(응급실일반병상)', value: `${displayData?.hvec ?? '-'}/${displayData?.hvs01 ?? '-'}` },
        { key: '2', name: '[응급실] 코호트 격리', value: `${displayData?.hv27 ?? '-'}/${displayData?.hvs59 ?? '-'}` },
        { key: '3', name: '[응급실] 음압 격리 병상', value: `${displayData?.hv29 ?? '-'}/${displayData?.hvs03 ?? '-'}` },
        { key: '4', name: '[응급실] 일반 격리 병상', value: `${displayData?.hv30 ?? '-'}/${displayData?.hvs04 ?? '-'}` },
        { key: '5', name: '[응급실] 소아', value: `${displayData?.hv28 ?? '-'}/${displayData?.hvs02 ?? '-'}` },
        { key: '6', name: '[응급실] 소아 음압 격리', value: `${displayData?.hv15 ?? '-'}/${displayData?.hvs48 ?? '-'}` },
        { key: '7', name: '[응급실] 소아일반격리', value: `${displayData?.hv16 ?? '-'}/${displayData?.hvs49 ?? '-'}` },


    ];

    const data2 = [
        // 응급전용
        { key: '8', name: '[응급전용] 중환자실 음압격리', value: `${displayData?.hv17 ?? '-'}/${displayData?.hvs50 ?? '-'}` },
        { key: '9', name: '[응급전용] 중환자실 일반격리', value: `${displayData?.hv18 ?? '-'}/${displayData?.hvs51 ?? '-'}` },
        { key: '10', name: '[응급전용] 입원실 음압격리', value: `${displayData?.hv19 ?? '-'}/${displayData?.hvs52 ?? '-'}` },
        { key: '11', name: '[응급전용] 입원실 일반격리', value: `${displayData?.hv21 ?? '-'}/${displayData?.hvs53 ?? '-'}` },
        { key: '12', name: '[응급전용] 중환자실', value: `${displayData?.hv31 ?? '-'}/${displayData?.hvs05 ?? '-'}` },
        { key: '13', name: '[응급전용] 소아중환자실', value: `${displayData?.hv33 ?? '-'}/${displayData?.hvs10 ?? '-'}` },
        { key: '14', name: '[응급전용] 입원실', value: `${displayData?.hv36 ?? '-'}/${displayData?.hvs19 ?? '-'}` },
        { key: '15', name: '[응급전용] 소아입원실', value: `${displayData?.hv37 ?? '-'}/${displayData?.hvs20 ?? '-'}` },


    ]

    const data3 = [
        // 중환자실
        { key: '16', name: '[중환자실] 일반', value: `${displayData?.hvicc ?? '-'}/${displayData?.hvs17 ?? '-'}` },
        { key: '17', name: '[중환자실] 내과', value: `${displayData?.hv2 ?? '-'}/${displayData?.hvs06 ?? '-'}` },
        { key: '18', name: '[중환자실] 외과', value: `${displayData?.hv3 ?? '-'}/${displayData?.hvs07 ?? '-'}` },
        { key: '19', name: '[중환자실] 흉부외과', value: `${displayData?.hvccc ?? '-'}/${displayData?.hvs16 ?? '-'}` },
        { key: '20', name: '[중환자실] 신경과', value: `${displayData?.hvcc ?? '-'}/${displayData?.hvs11 ?? '-'}` },
        { key: '21', name: '[중환자실] 신경외과', value: `${displayData?.hv6 ?? '-'}/${displayData?.hvs12 ?? '-'}` },
        { key: '22', name: '[중환자실] 외상', value: `${displayData?.hv9 ?? '-'}/${displayData?.hvs14 ?? '-'}` },
        { key: '23', name: '[중환자실] 화상', value: `${displayData?.hv8 ?? '-'}/${displayData?.hvs13 ?? '-'}` },
        { key: '24', name: '[중환자실] 소아', value: `${displayData?.hv32 ?? '-'}/${displayData?.hvs09 ?? '-'}` },
        { key: '25', name: '[중환자실] 신생아', value: `${displayData?.hvncc ?? '-'}/${displayData?.hvs08 ?? '-'}` },
        { key: '26', name: '[중환자실] 심장내과', value: `${displayData?.hv34 ?? '-'}/${displayData?.hvs15 ?? '-'}` },
        { key: '27', name: '[중환자실] 음압격리', value: `${displayData?.hv35 ?? '-'}/${displayData?.hvs18 ?? '-'}` },


    ]

    const data4 = [
        { key: '28', name: '[입원실] 일반', value: `${displayData?.hvgc ?? '-'}/${displayData?.hvs38 ?? '-'}` },
        { key: '29', name: '[입원실] 음압격리', value: `${displayData?.hv41 ?? '-'}/${displayData?.hvs25 ?? '-'}` },
        { key: '30', name: '[입원실] 정신과 폐쇄병동', value: `${displayData?.hv40 ?? '-'}/${displayData?.hvs24 ?? '-'}` },
        { key: '31', name: '[입원실] 분만실', value: `${displayData?.hv42 ?? '-'}/${displayData?.hvs26 ?? '-'}` },
        { key: '32', name: '[기타] 수술실', value: `${displayData?.hvoc ?? '-'}/${displayData?.hvs22 ?? '-'}` },


        // 기타
        // { key: '12', name: '격리진료구역 음압격리병상', value: displayData?.hv13 },
        // { key: '13', name: '격리진료구역 일반격리병상', value: displayData?.hv14 },
        // { key: '20', name: '감염병 전담병상 중환자실', value: displayData?.hv22 },
        // { key: '21', name: '감염병 전담병상 중환자실 내 음압격리병상', value: displayData?.hv23 },
        // { key: '22', name: '[감염] 중증 병상', value: displayData?.hv24 },
        // { key: '23', name: '[감염] 준-중증 병상', value: displayData?.hv25 },
        // { key: '24', name: '[감염] 중등증 병상', value: displayData?.hv26 },
        // { key: '36', name: '[입원실] 외상전용', value: displayData?.hv38 },
        // { key: '37', name: '[기타] 외상전용 수술실', value: displayData?.hv39 },
        // { key: '38', name: '[입원실] 정신과 폐쇄병동', value: displayData?.hv40 },
        // { key: '39', name: '[입원실] 음압격리', value: displayData?.hv41 },
        // { key: '40', name: '[기타] 분만실', value: displayData?.hv42 },
        // { key: '41', name: '[기타] 화상전용처치실', value: displayData?.hv43 }

    ]



    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={900}
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
                        <PhoneOutlined className="icon" />
                        <p>당직의: {displayData?.hv1}</p>
                    </div>
                    <div className="info-item">
                        <PhoneOutlined className="icon" />
                        <p>소아 당직의: {displayData?.hv12}</p>
                    </div>
                    <div className="info-item">
                        <ClockCircleTwoTone className="icon" />
                        <p>
                            최근 업데이트 시간: {typeof displayData?.hvidate === 'number' ?
                                `${String(displayData.hvidate).slice(0, 4)}.${String(displayData.hvidate).slice(4, 6)}.${String(displayData.hvidate).slice(6, 8)} ${String(displayData.hvidate).slice(8, 10)}:${String(displayData.hvidate).slice(10, 12)}:${String(displayData.hvidate).slice(12, 14)}` :
                                '-'}
                        </p>


                    </div>

                    <div className="info-item">
                        <Descriptions title="장비 가용 여부" bordered>
                            <Descriptions.Item label="CT 가용">
                                {displayData?.hvctayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="MRI 가용">
                                {displayData?.hvmriayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="혈관촬영기 가용">
                                {displayData?.hvangioayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="조영촬영기 가용">
                                {displayData?.hvangioayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="인공호흡기 가용">
                                {displayData?.hvventiayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="인큐베이터 가용">
                                {displayData?.hvincuayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="CRRT 가용">
                                {displayData?.hvcrrtayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="ECMO 가용">
                                {displayData?.hvecmoayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="고압산소치료기 가용">
                                {displayData?.hvoxyayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="중심체온조절유도기 가용">
                                {displayData?.hvhypoayn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="구급차 가용">
                                {displayData?.hvamyn === 'Y' ? (
                                    <Badge status="success" text="Y" />
                                ) : (
                                    <Badge status="error" text="N" />
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Table columns={columns1} dataSource={data1} pagination={false} />
                    <Table columns={columns2} dataSource={data2} pagination={false} />
                    <Table columns={columns3} dataSource={data3} pagination={false} />
                    <Table columns={columns4} dataSource={data4} pagination={false} />
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