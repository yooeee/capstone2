// 기본 지도 설정
const baseMap = new ol.source.XYZ({
  url: "http://api.vworld.kr/req/wmts/1.0.0/F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF/Base/{z}/{y}/{x}.png",
  crossOrigin: "anonymous",
  transition: 0,
});

const locationVectorSource = new ol.source.Vector();

const locationVectorLayer = new ol.layer.Vector({
  source: locationVectorSource,
  zIndex: 1000,
});

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: baseMap,
      preload: 20,
    }),
    locationVectorLayer,
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([128.04544021875, 35.6988685552633]),
    zoom: 7.6,
    minZoom: 7.6,
  }),
});

document.addEventListener('DOMContentLoaded', () => {
  init();
  setEvent();
});

function init() {
  // 초기화 작업이 필요한 경우 추가 가능
}

function setEvent() {
  document.getElementById('locationBtn').addEventListener('click', () => {
    getLocation();
  });
}

// 현재 위치 조회 및 지도에 표시
function getLocation() {
  if (!navigator.geolocation) {
    console.error("Geolocation이 지원되지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("위도:", latitude, "경도:", longitude);

      // 현재 위치 좌표를 OpenLayers 좌표로 변환
      const coords = ol.proj.fromLonLat([longitude, latitude]);

      // 위치 마커 스타일 정의 (빨간색 원)
      const locationMarkerStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({ color: 'red' }),
          stroke: new ol.style.Stroke({ color: 'white', width: 2 })
        }),
      });

      // 위치 마커 생성 및 추가
      const locationFeature = new ol.Feature({
        geometry: new ol.geom.Point(coords),
      });
      locationFeature.setStyle(locationMarkerStyle);

      // 기존 마커 제거하고 새로운 마커 추가
      locationVectorSource.clear();
      locationVectorSource.addFeature(locationFeature);

      // 지도 뷰를 현재 위치로 이동
      map.getView().animate({
        center: coords,
        zoom: 15, // 적절한 줌 레벨로 설정
        duration: 1000,
      });
    },
    (error) => {
      console.error("오류:", error.message);
    }
  );
}


function removeLayer(name) {
  
    map.getAllLayers().forEach(layer => {
        if (layer && layer.get('name') == name) {
            map.removeLayer(layer);
        }
    });

}
