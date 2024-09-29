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
import { Style, Icon } from "ol/style";
import { Button, Popover } from "antd"; // Popover 컴포넌트 import
import { AimOutlined } from "@ant-design/icons";
import { createRoot } from "react-dom/client";
import { boundingExtent } from "ol/extent";

interface OLMapProps {
  searchResult: any[];
}

const OLMap: React.FC<OLMapProps> = ({ searchResult }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const baseMap = new XYZ({
      url:
        "http://api.vworld.kr/req/wmts/1.0.0/F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF/Base/{z}/{y}/{x}.png",
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
        new VectorLayer({
          source: (vectorSourceRef.current = new VectorSource()),
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
            map.getView().setZoom(15);
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
        console.log(searchResult);

        searchResult.forEach((item) => {
          const { wgs84Lon, wgs84Lat, dutyName } = item;

          const marker = new Feature({
            geometry: new Point(fromLonLat([wgs84Lon, wgs84Lat])),
          });

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

          vectorSourceRef.current!.addFeature(marker);
          coords.push([wgs84Lon, wgs84Lat]);
          // Popover 대신 Overlay로 팝업 표시
          const popupOverlay = new Overlay({
            positioning: 'bottom-center',
            stopEvent: false,
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
          popupOverlay.setElement(popoverDiv);

          map.addOverlay(popupOverlay);

          // 팝업 위치 설정
          const coordinate = fromLonLat([wgs84Lon, wgs84Lat]);
          popupOverlay.setPosition(coordinate);
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

    return () => {
      map.setTarget(undefined);
    };
  }, [searchResult]);

  return (
    <div
      ref={mapRef}
      className="ol-map-container"
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
};

export default OLMap;
