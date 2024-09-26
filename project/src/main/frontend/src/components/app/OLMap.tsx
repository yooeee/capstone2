import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import Tile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import "../../assets/styles/OLMap.css";
import { Button } from "antd";
import { AimOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

const OLMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const baseMap = new XYZ({
      url:
        "http://api.vworld.kr/req/wmts/1.0.0/" +
        "F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF" +
        "/Base/{z}/{y}/{x}.png",
      crossOrigin: "anonymous",
      transition: 0,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new Tile({
          source: baseMap,
          preload: 20,
        }),
      ],
      view: new View({
        center: fromLonLat([128.04544021875, 35.6988685552633]),
        zoom: 7.6,
        minZoom: 7.6,
      }),
    });

    // 내 위치 조회 버튼 추가
    const locateButton = document.createElement("div");
    locateButton.style.position = "absolute";
    locateButton.style.top = "10px";
    locateButton.style.right = "10px";
    locateButton.style.zIndex = "1000";

    const handleLocate = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.getView().setCenter(fromLonLat([longitude, latitude]));
            map.getView().setZoom(12);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    const antdButton = (
      <Button type="primary" onClick={handleLocate}>
        <AimOutlined /> 내 위치 조회
      </Button>
    );

    ReactDOM.render(antdButton, locateButton);
    mapRef.current.appendChild(locateButton);

    return () => {
      map.setTarget(undefined); // 컴포넌트 언마운트 시 지도 제거
    };

  }, []);

  return <div ref={mapRef} className="ol-map-container"></div>;
};

export default OLMap;
