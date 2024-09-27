import React, { useEffect, useState } from "react";
import { Layout, Select, Input } from "antd";
import "../../assets/styles/SideMenu.css";
import axios from "axios";
import { Location } from "./../../types/types";

const { Sider } = Layout;
const { Option } = Select;
const { Search } = Input;

const SideMenu: React.FC<{ updateLocations: (locations: any[]) => void }> = ({
  updateLocations,
}) => {
  const [urlType, setUrlType] = useState("getEgytListInfoInqire");
  const [sido, setSido] = useState("sido");
  const [sigungu, setSigungu] = useState("sigungu");
  const [name, setName] = useState("");
  const [sigunguOptions, setSigunguOptions] = useState<string[]>([]);

  /**
   *  검색버튼 클릭시 OPEN API 호출
   */
  const searchApi = async () => {
    if (sido === "sido" || sigungu == "sigungu") {
      alert("지역을 선택해주세요.");
      return false;
    }

    try {
      const serviceKey =
        "Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D";
      const params = {
        Q0: sido,
        Q1: sigungu,
        pageNo: 1,
        numOfRows: 999,
        QN: name,
      };
      const response = await axios.get(
        `https://apis.data.go.kr/B552657/ErmctInfoInqireService/${urlType}?serviceKey=${serviceKey}`,
        { params }
      );
      const items = response.data.response.body.items.item;
      if (items) {
        updateLocations(items); // 위치 데이터 전달
      } else {
        alert("조회 결과 없습니다.");
        return;
      }
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

  // 시도 변경 시 API 호출하여 시군구 데이터 업데이트
  useEffect(() => {
    if (sido && sido !== "sido") {
      fetchSigunguData(sido);
    } else {
      //setSigunguOptions([]); // 시도 선택 해제 시 시군구 리스트 초기화
    }
  }, [sido]);


  const fetchSigunguData = async (sido: string) => {
    try {
      const serviceKey = 'Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D';
      const params ={
        pageNo : 1,
        numOfRowsA : 50,
        type : 'json',
        locatadd_nm : sido,
      };
      const response = await axios.get(
        `http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList?serviceKey=${serviceKey}`, {params}
      );
      const items = response.data.StanReginCd[1].row;
      if (items) {
        console.log(items);
      } else {
        setSigunguOptions([]);
      }
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

  return (
    <Sider width={300}>
      <div className="logo">전국 응급의료기관 정보 조회 서비스</div>

      <div className="sidemenu-box">
        {/* Select 박스 - 시도 및 시군구 */}
        <div className="sidemenu-admcode">
          <div>
            <Select
              defaultValue="sido"
              className="sdsgg"
              onChange={(value) => setSido(value)}
            >
              <Option value="sido" disabled>
                시도 선택
              </Option>
              <Option value="">전체</Option>
              <Option value="서울특별시">서울특별시</Option>
              <Option value="부산광역시">부산광역시</Option>
              <Option value="대구광역시">대구광역시</Option>
              <Option value="인천광역시">인천광역시</Option>
              <Option value="광주광역시">광주광역시</Option>
              <Option value="대전광역시">대전광역시</Option>
              <Option value="울산광역시">울산광역시</Option>
              <Option value="세종특별자치시">세종특별자치시</Option>
              <Option value="경기도">경기도</Option>
              <Option value="강원도">강원도</Option>
              <Option value="충청북도">충청북도</Option>
              <Option value="충청남도">충청남도</Option>
              <Option value="전라북도">전라북도</Option>
              <Option value="전라남도">전라남도</Option>
              <Option value="경상북도">경상북도</Option>
              <Option value="경상남도">경상남도</Option>
              <Option value="제주특별자치도">제주특별자치도</Option>
            </Select>
            <Select
              defaultValue="sigungu"
              className="sdsgg"
              onChange={(value) => setSigungu(value)}
            >
              <Option value="sigungu" disabled>
                시군구 선택
              </Option>
              <Option value="">전체</Option>
              {sigunguOptions.map((sigungu) => (
                <Option key={sigungu} value={sigungu}>
                  {sigungu}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Select 박스 - 분류 */}
        <div className="sidemenu-select-box">
          <Select
            defaultValue="getEgytListInfoInqire"
            style={{ width: "100%" }}
            onChange={(value) => setUrlType(value)}
          >
            <Option value="getEgytListInfoInqire">
              응급의료기관 목록정보 조회
            </Option>
            <Option value="getStrmListInfoInqire">
              외상센터 목록정보 조회
            </Option>
            {/* 여기에 분류 옵션들을 추가하세요 */}
          </Select>
        </div>

        {/* 검색 기능 */}
        <div className="sidemenu-search-box">
          <Search
            placeholder="기관명을 입력하세요"
            onSearch={(value) => {
              setName(value);
              searchApi();
            }}
            enterButton
          />
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="sidemenu-search-result"></div>

      {/* 사이드바 하단 Footer 추가 */}
      <div className="sidemenu-footer">Copyright © 2024</div>
    </Sider>
  );
};

export default SideMenu;
