import React, { useEffect, useRef, useState } from "react";
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
import { Button, Flex } from "antd";
import { AimOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import { createRoot } from "react-dom/client";
import CircleStyle from "ol/style/Circle";
import axios from "axios";
import { LineString } from "ol/geom";




const OLMap = ({ searchResult, onItemSelect, urlType }) => {
  const mapRef = useRef(null);
  const locationVectorSourceRef = useRef(null);
  const markerVectorSourceRef = useRef(null);
  const routeVectorSourceRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [myLocation, setMyLocation] = useState(null);



  // 지도 초기화용 useEffect
  useEffect(() => {
    if (!mapRef.current) return;

    const baseMap = new XYZ({
      url: "http://api.vworld.kr/req/wmts/1.0.0/F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF/Base/{z}/{y}/{x}.png",
      crossOrigin: "anonymous",
      transition: 0,
    });

    const locationVectorSource = new VectorSource();
    locationVectorSourceRef.current = locationVectorSource;

    const locationVectorLayer = new VectorLayer({
      source: locationVectorSource,
      zIndex: 1000,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new Tile({
          source: baseMap,
          preload: 20,
        }),
        locationVectorLayer,
      ],
      view: new View({
        center: fromLonLat([128.04544021875, 35.6988685552633]),
        zoom: 7.6,
        minZoom: 7.6,
      }),
    });

    mapInstanceRef.current = map;

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
            setMyLocation({ latitude, longitude });
            map.getView().setCenter(fromLonLat([longitude, latitude]));
            map.getView().setZoom(15);

            // 빨간색 점 생성
            const point = new Feature({
              geometry: new Point(fromLonLat([longitude, latitude])),
            });

            point.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                    color: "red",
                  }),
                }),
              })
            );

            if (locationVectorSourceRef.current) {
              locationVectorSourceRef.current.clear();
              locationVectorSourceRef.current.addFeature(point);
            }
            
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

    return () => {
      map.setTarget(undefined);
    };
  }, []); // 빈 배열로 처음 마운트될 때 한 번만 실행
  // 마커 추가용 useEffect
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {

      removeLayer('markerLayer');
      document.querySelectorAll(".ol-popup-custom").forEach(element => {
        element.remove();
      });



      const markerVectorSource = new VectorSource();
      markerVectorSourceRef.current = markerVectorSource;


      const markerVectorLayer = new VectorLayer({
        source: markerVectorSource,
        name: 'markerLayer'
      });

      map.addLayer(markerVectorLayer);

      const markerCoords = [];

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

        markerVectorSource.addFeature(marker);
        // 마커 좌표 추가
        markerCoords.push(fromLonLat([wgs84Lon, wgs84Lat]));

        // 팝업 오버레이 생성
        const popupOverlay = new Overlay({
          positioning: "bottom-center",
          stopEvent: true,
          offset: [0, -10],
        });

        const popoverDiv = document.createElement("div");
        popoverDiv.className = "ol-popup-custom";
        popoverDiv.style.backgroundColor = "white";
        popoverDiv.style.padding = "5px 10px";
        popoverDiv.style.border = "1px solid #ccc";
        popoverDiv.style.borderRadius = "4px";
        popoverDiv.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        popoverDiv.style.cursor = "pointer";
        popoverDiv.style.display = "flex";
        popoverDiv.style.justifyContent = "space-between";
        popoverDiv.style.alignItems = "center";

        // 이름을 표시하는 div
        const nameDiv = document.createElement("div");
        nameDiv.innerHTML = `<strong>${dutyName}</strong>`;
        nameDiv.style.flex = "1"; // 좌측에 위치
        nameDiv.style.marginRight = "10px";

        const routeButtonDiv = (
          <Button
            type="primary"
            onClick={() => {
              if (myLocation && myLocation.latitude && myLocation.longitude) {
                // 나머지 마커와 팝업 삭제
                markerVectorSourceRef.current.getFeatures().forEach((feature) => {
                  if (feature !== marker) {
                    markerVectorSourceRef.current.removeFeature(feature);
                  }
                });
        
                document.querySelectorAll(".ol-popup-custom").forEach((element) => {
                  if (element !== popoverDiv) {
                    element.remove();
                  }
                });
        
                // 선택된 마커 경로 찾기 실행
                getRouteData(myLocation, { latitude: wgs84Lat, longitude: wgs84Lon });
              } else {
                alert("내 위치를 먼저 조회해주세요.");
              }
            }}
          >
            도착
          </Button>
        );

        // React 요소를 DOM에 추가
        const container = document.createElement("div");
        const root = createRoot(container);
        root.render(routeButtonDiv);


        // 팝업에 nameDiv와 routeButtonDiv를 추가
        popoverDiv.appendChild(nameDiv);
        popoverDiv.appendChild(container);

        // 팝업 클릭 시 사이드바에 데이터 전달
        nameDiv.addEventListener('click', () => {
          onItemSelect(item, urlType);
        });

        popupOverlay.setElement(popoverDiv);
        map.addOverlay(popupOverlay);

        // 팝업 위치 설정
        const coordinate = fromLonLat([wgs84Lon, wgs84Lat]);
        popupOverlay.setPosition(coordinate);
      });

      if (markerCoords.length > 0) {
        const extent = markerVectorSource.getExtent(); // 마커들의 경계 범위
        map.getView().fit(extent, { padding: [200, 200, 200, 200] }); // 지도의 뷰를 범위에 맞춰 조정
      }
    }
  }, [searchResult]); // searchResult가 변경될 때마다 실행


  // 길찾기 데이터 추가용 useEffect
  const getRouteData = async (myLocation, destination) => {
    try {
      const response = await axios.get(
        `https://apis-navi.kakaomobility.com/v1/directions?origin=${myLocation.longitude},${myLocation.latitude}&destination=${destination.longitude},${destination.latitude}`,
        {
          headers: {
            Authorization: `KakaoAK bacf6d9a107d628abaf4e76e10a1409e`,
            "Content-Type": "application/json",
          },
        }
      );

      let routePoints = [];

      if (response.data) {
        removeLayer('routeLayer');

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

        routeLine.setStyle([
          new Style({
            stroke: new Stroke({
              color: "black", // 외부 검정색
              width: 5, // 외곽선 두께
            }),
          }),
          new Style({
            stroke: new Stroke({
              color: "green", // 내부 녹색
              width: 2, // 내부선 두께
            }),
          }),
        ]);
        


        const routeVectorSource = new VectorSource();
        routeVectorSourceRef.current = routeVectorSource;

        const routeVectorLayer = new VectorLayer({
          name: 'routeLayer',
          source: routeVectorSource,
          zIndex: 10,
        });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.addLayer(routeVectorLayer);
          routeVectorSource.addFeature(routeLine);

          // 경로의 범위를 계산하여 지도의 뷰를 그 범위에 맞춤
          const routeExtent = routeVectorSource.getExtent();
          mapInstanceRef.current.getView().fit(routeExtent, {
            padding: [150, 150, 150, 150], // 지도의 여백을 설정
            maxZoom: 16, // 최대 줌 레벨 설정
          });
        }
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const removeLayer = (name) => {
    mapInstanceRef.current.getAllLayers().forEach(layer => {
      if (layer && layer.get('name') == name) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
  }


  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default OLMap;
