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

  // 내 위치조회 버튼
  document.getElementById('locationBtn').addEventListener('click', () => {
    getLocationAndMoveMap();
  });

  // 시도 선택 변경 시 시군구 데이터 가져오기
  document.getElementById("sido-select").addEventListener("change", (event) => {
    const selectedBjcd = event.target.selectedOptions[0].dataset.bjcd || "";
    getSigunguData(selectedBjcd);
  });

  document.getElementById('searchBtn').addEventListener('click',() => {
    search();
  });



}
async function search() {
  const sidoSelect = document.getElementById("sido-select");
  const sigunguSelect = document.getElementById("sigungu-select");
  const searchInput = document.getElementById("searchInput");
  const urlType = document.getElementById("urlTypeSelect");

  if (sidoSelect.value === "sido" || sigunguSelect.value === "sigungu") {
    alert("지역을 선택해주세요.");
    return false;
  }

  try {
    const serviceKey =
      "Rp3BBPXWUa87%2FSjDhgBJqX1YM9bO7p51NvNrIXjn0h3eWd8Yu%2FLIQzBg7c8S55X815Q5Pn8Dc37iIz8887K%2Ffw%3D%3D";
    
    // axios 요청 URL 및 파라미터 설정
    const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/${urlType.value}`;
    const params = {
      Q0: sidoSelect.value,
      Q1: sigunguSelect.value,
      pageNo: 1,
      numOfRows: 999,
      QN: searchInput.value,
      serviceKey: serviceKey,
    };

    const response = await axios.get(url, { params });
    const items = response.data.response.body.items.item;

    if (items) {
      console.log(items);
    } else {
      alert("조회 결과 없습니다.");
      return;
    }
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}






// 현재 위치 조회 및 지도에 표시
function getLocationAndMoveMap() {
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

// 지도 레이어 삭제
function removeLayer(name) {
    map.getAllLayers().forEach(layer => {
        if (layer && layer.get('name') == name) {
            map.removeLayer(layer);
        }
    });

}
// 시군구 옵션 업데이트 함수
function setSigunguOptions(sigunguList) {
  const sigunguSelect = document.getElementById("sigungu-select");

  // 기존 옵션을 모두 삭제
  sigunguSelect.innerHTML = '';

  // 기본 "전체" 옵션 추가
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "전체";
  sigunguSelect.appendChild(defaultOption);

  // 새로운 시군구 옵션 추가 (sigunguList가 비어있지 않을 때만 추가)
  if (sigunguList.length > 0) {
    sigunguList.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      sigunguSelect.appendChild(option);
    });
  }
}

// 시군구 조회 함수
async function getSigunguData(bjcd) {
  // 시도에서 "전체"를 선택한 경우 시군구에 "전체" 옵션만 표시
  if (bjcd === "") {
    setSigunguOptions([]);
    return;
  }

  try {
    const response = await fetch(`/api/admcode?bjcd=${bjcd}`);
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    if (data) {
      const sigunguList = data.map((item) => item.name);
      setSigunguOptions(sigunguList);
    }
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}


// XML 문자열을 JSON으로 변환하는 함수
function xmlToJson(xml) {
  const obj = {};

  // XML 요소가 없는 경우
  if (xml.nodeType === 1 && xml.childNodes.length === 0) {
    return xml.textContent || "";
  }

  // XML 요소가 있는 경우
  if (xml.nodeType === 1 && xml.childNodes.length > 0) {
    for (const child of xml.childNodes) {
      if (child.nodeType === 1) { // ELEMENT_NODE
        const childName = child.nodeName;
        const childJson = xmlToJson(child);

        if (obj[childName] === undefined) {
          obj[childName] = childJson;
        } else {
          // 동일한 태그가 여러 번 나타나면 배열로 변환
          if (!Array.isArray(obj[childName])) {
            obj[childName] = [obj[childName]];
          }
          obj[childName].push(childJson);
        }
      }
    }
  }

  return obj;
}

