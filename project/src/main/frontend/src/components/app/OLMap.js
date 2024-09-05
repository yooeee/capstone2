import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import Tile from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import axios from 'axios';

const OLMap = () => {
  const mapRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D&STAGE1=%EC%84%9C%EC%9A%B8&STAGE2=%EA%B0%95%EB%82%A8%EA%B5%AC&pageNo=1&numOfRows=10'
      );
      console.log(response.data);  // 응답 데이터 출력
    } catch (error) {
      console.error('Error fetching the data:', error);
    }
  };

  fetchData();
  useEffect(() => {
    // OpenLayers 지도 객체 생성
    const baseMap = new XYZ({
        url: 'http://api.vworld.kr/req/wmts/1.0.0/' + 'F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF' + '/Base/{z}/{y}/{x}.png',
        crossOrigin: 'anonymous',
        transition: 0,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new Tile({
            source: baseMap,
            name: 'baseMap',
            preload: 20,
            renderMode: 'vector',
        }),
      ],
      view: new View({
        center: fromLonLat([126.9780, 37.5665]), 
        zoom: 7, 
        minZoom : 7,
      }),
    });

    return () => {
      map.setTarget(null); // 컴포넌트 언마운트 시 지도 제거
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%' }} 
    ></div>
  );
};

export default OLMap;
