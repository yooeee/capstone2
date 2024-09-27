import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import Tile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from "ol/style";
import { Button } from "antd";
import { AimOutlined } from "@ant-design/icons";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { boundingExtent } from "ol/extent";  // extent 모듈 import 추가

interface OLMapProps {
  locations: any[]; // Location 구조를 명시하지 않고 any[]로 설정
}

const OLMap: React.FC<OLMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null); // VectorSource를 저장할 ref
  
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
        // 벡터 레이어 추가
        new VectorLayer({
          source: (vectorSourceRef.current = new VectorSource()), // VectorSource 초기화
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

    // createRoot로 버튼 렌더링
    const root = createRoot(locateButton); // createRoot 사용
    root.render(antdButton); // 버튼 렌더링
    mapRef.current.appendChild(locateButton);

    const addMarkers = () => {
      if (vectorSourceRef.current) {
        vectorSourceRef.current.clear();
        const coords: [number, number][] = []; 

        locations.forEach((location) => {
          const { wgs84Lon, wgs84Lat } = location;

          const marker = new Feature({
            geometry: new Point(fromLonLat([wgs84Lon, wgs84Lat])),
          });

          // 마커 스타일 설정
          marker.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/images/location.png',
                scale: 0.07,
            }),
            })
          );

          vectorSourceRef.current!.addFeature(marker); // 벡터 소스에 마커 추가
          coords.push([wgs84Lon, wgs84Lat]);  // coords 리스트에 좌표 추가

          
        });
        const filteredCoords = coords.filter(
          (item) => item[0] != null && item[1] != null
        );
    
        if (filteredCoords.length > 0) {
          const extent = boundingExtent(filteredCoords.map((coord) => fromLonLat(coord))); // extent 계산
          map.getView().fit(extent, {
            size: map.getSize(),
            padding: [300, 300, 300, 300],
          });
        }

      }
    };

    addMarkers(); // 컴포넌트가 마운트될 때 처음 마커 추가

    return () => {
      map.setTarget(undefined); // 컴포넌트 언마운트 시 지도 제거
    };
  }, [locations]); // locations prop이 변경될 때마다 effect 실행

  return (
    <div
      ref={mapRef}
      className="ol-map-container"
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
};

export default OLMap;
