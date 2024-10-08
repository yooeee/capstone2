import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import Tile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Fill, Stroke } from "ol/style";
import { Button } from "antd"; // Popover 컴포넌트 import
import { AimOutlined } from "@ant-design/icons";
import { createRoot } from "react-dom/client";
import { boundingExtent } from "ol/extent";
import CircleStyle from "ol/style/Circle";
import axios from "axios";
import { LineString } from "ol/geom";

interface OLMapProps {
  searchResult: any[];
  urlType: string;
  onItemSelect: (item: any, urlType: string) => void;
}

const OLMap: React.FC<OLMapProps> = ({
  searchResult,
  onItemSelect,
  urlType,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const popupOverlayRef = useRef<Overlay | null>(null); // 팝업 오버레이 참조 추가

  useEffect(() => {
    if (!mapRef.current) return;

    const baseMap = new XYZ({
      url: "http://api.vworld.kr/req/wmts/1.0.0/F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF/Base/{z}/{y}/{x}.png",
      crossOrigin: "anonymous",
      transition: 0,
    });

    // 벡터 소스 초기화
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource; // 벡터 소스를 참조에 할당

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new Tile({
          source: baseMap,
          preload: 20,
        }),
        vectorLayer, // 벡터 레이어 추가
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
            map.getView().setZoom(15);

            // 빨간색 점 생성
            const point = new Feature({
              geometry: new Point(fromLonLat([longitude, latitude])),
            });

            // 점 스타일 설정 (빨간색 원형 점)
            point.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 7, // 점의 반지름
                  fill: new Fill({
                    color: "red", // 빨간색
                  }),
                }),
              })
            );

            // 벡터 소스와 레이어 추가
            const vectorSource = new VectorSource({
              features: [point],
            });

            const markerLayer = new VectorLayer({
              source: vectorSource,
            });

            map.addLayer(markerLayer);
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

    const root = createRoot(locateButton);
    root.render(antdButton);
    mapRef.current.appendChild(locateButton);

    const addMarkers = () => {
      if (vectorSourceRef.current) {
        vectorSourceRef.current.clear();
        const coords: [number, number][] = [];

        searchResult.forEach((item) => {
          const { wgs84Lon, wgs84Lat, dutyName } = item;

          const marker = new Feature({
            geometry: new Point(fromLonLat([wgs84Lon, wgs84Lat])),
            name: "marker",
            datas: item,
          });

          marker.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 25],
                anchorXUnits: "fraction",
                anchorYUnits: "pixels",
                src: "/images/location.png",
                scale: 0.07,
              }),
            })
          );

          vectorSourceRef.current!.addFeature(marker);
          coords.push([wgs84Lon, wgs84Lat]);

          // 팝업 오버레이 생성
          const popupOverlay = new Overlay({
            positioning: "bottom-center",
            stopEvent: true, // 클릭 이벤트를 전파할지 설정
            offset: [0, -10],
          });

          const popoverDiv = document.createElement("div");
          popoverDiv.className = "ol-popup";
          popoverDiv.innerHTML = `<strong>${dutyName}</strong>`;
          popoverDiv.style.backgroundColor = "white";
          popoverDiv.style.padding = "5px 10px";
          popoverDiv.style.border = "1px solid #ccc";
          popoverDiv.style.borderRadius = "4px";
          popoverDiv.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
          popoverDiv.style.cursor = "pointer"; // 커서 변경

          // 팝업 클릭 시 사이드바에 데이터 전달
          popoverDiv.onclick = () => {
            onItemSelect(item, urlType); // 아이템 선택
          };

          popupOverlay.setElement(popoverDiv);
          map.addOverlay(popupOverlay);

          // 팝업 위치 설정
          const coordinate = fromLonLat([wgs84Lon, wgs84Lat]);
          popupOverlay.setPosition(coordinate);
          popupOverlayRef.current = popupOverlay; // 팝업 오버레이 참조 저장
        });

        const filteredCoords = coords.filter(
          (item) => item[0] != null && item[1] != null
        );

        if (filteredCoords.length > 0) {
          const extent = boundingExtent(
            filteredCoords.map((coord) => fromLonLat(coord))
          );
          map.getView().fit(extent, {
            size: map.getSize(),
            padding: [300, 300, 300, 300],
          });
        }
      }
    };

    addMarkers();
    const getRouteData = async () => {
      try {
        const response = await axios.get(
          `https://apis-navi.kakaomobility.com/v1/directions?origin=126.656267,37.451294&destination=126.884459,37.480069`,
          {
            headers: {
              Authorization: `KakaoAK bacf6d9a107d628abaf4e76e10a1409e`,
              "Content-Type": "application/json",
            },
          }
        );

        let routePoints: any[] = [];

        if (response.data) {
          const sections = response.data.routes[0].sections;
          let totalDistance = 0; // 총 거리
          let totalDuration = 0; // 총 시간
          // 각 도로의 distance와 duration 더하기
          sections.forEach((section) => {
            totalDistance += section.distance; // 거리 추가 (m 단위)
            totalDuration += section.duration; // 시간 추가 (초 단위)
          });

          // 거리 단위 변환
          const totalDistanceInKm = (totalDistance / 1000).toFixed(2); // m를 km로 변환하고 소수점 2자리로 반올림

          // 시간 단위 변환
          const hours = Math.floor(totalDuration / 3600); // 총 시간에서 시간 계산
          const minutes = Math.floor((totalDuration % 3600) / 60); // 남은 시간에서 분 계산
          const seconds = totalDuration % 60; // 남은 초 계산

          // 결과 출력
          console.log(`총 거리: ${totalDistanceInKm} km`);
          console.log(`총 시간: ${hours}시간 ${minutes}분 ${seconds}초`);

          const vertexes = response.data.routes[0].sections[0].roads.flatMap(
            (road) => road.vertexes
          );

          // 좌표 쌍을 생성
          for (let i = 0; i < vertexes.length; i += 2) {
            routePoints.push(fromLonLat([vertexes[i], vertexes[i + 1]]));
          }

          // LineString 생성
          const routeLine = new Feature({
            geometry: new LineString(routePoints),
            name: "routeLine",
          });

          routeLine.setStyle(
            new Style({
              stroke: new Stroke({
                color: "blue",
                width: 5,
              }),
            })
          );

          // vectorSourceRef가 null이 아닌지 확인 후 addFeature 호출
          if (vectorSourceRef.current) {
            vectorSourceRef.current.addFeature(routeLine);
          } else {
            console.error("vectorSourceRef is null");
          }
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    getRouteData(); // 라우트 데이터 가져오기

    map.on("singleclick", (event) => {
      const clickedPixel = map.getEventPixel(event.originalEvent);
      const clickedFeatures = map.getFeaturesAtPixel(clickedPixel);
      const markerFeature = Array.from(clickedFeatures).filter(
        (clickFeature) => {
          return clickFeature.getProperties().name === "marker";
        }
      );

      if (markerFeature.length > 0) {
        onItemSelect(markerFeature[0].getProperties().datas, urlType);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [searchResult]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default OLMap;
