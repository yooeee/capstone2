// 기본 지도 설정
const baseMap = new ol.source.XYZ({
  url: "http://api.vworld.kr/req/wmts/1.0.0/B0AD4088-CA61-382A-8F7F-A4B7CB606909/Base/{z}/{y}/{x}.png",
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

let myLocation = {
  longitude: null,
  latitude: null,
};

// Bootstrap 모달 객체 생성
const hospitalModal = new bootstrap.Modal(document.getElementById('hospitalModal'));

// 경로 정보 표시용 div 추가 (지도 우측 하단에 위치)
const routeInfoDiv = document.createElement("div");
routeInfoDiv.className = "route-info-div";
routeInfoDiv.style.position = "absolute";
routeInfoDiv.style.bottom = "10px";  // 하단으로 위치 변경
routeInfoDiv.style.right = "10px";
routeInfoDiv.style.backgroundColor = "#001f3f"; // 남색 배경
routeInfoDiv.style.color = "#ffffff"; // 흰색 글자
routeInfoDiv.style.padding = "10px";
routeInfoDiv.style.borderRadius = "8px";
routeInfoDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
routeInfoDiv.style.display = "none"; // 처음에는 숨김
routeInfoDiv.style.zIndex = "1000"; // 지도 요소 위에 표시
document.getElementById("map").appendChild(routeInfoDiv);


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

  document.getElementById('searchBtn').addEventListener('click', () => {
    search();
  });

  document.getElementById('aiBtn').addEventListener('click', (e) => {
    e.target.style.display = 'none';
    document.getElementById('loadingBtn').style.display = 'block';
    getAIAnswer();
  })



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
      "";

    // URL 및 파라미터 설정
    const params = new URLSearchParams({
      Q0: sidoSelect.value,
      Q1: sigunguSelect.value,
      pageNo: 1,
      numOfRows: 999,
      QN: searchInput.value,
    });

    const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/${urlType.value}?serviceKey=${serviceKey}&${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json" // JSON 응답을 요청하는 헤더
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const items = data.response.body.items.item;

    if (items) {
      drawMarkerWithSearch(items);
      routeInfoDiv.style.display = "none";
    } else {
      alert("조회 결과 없습니다.");
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
      myLocation.latitude = latitude;
      myLocation.longitude = longitude;
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
// 검색결과 마커 그리기 함수
function drawMarkerWithSearch(searchList) {
  // 기존 마커 레이어 제거
  removeAllLayer();

  searchList = Array.isArray(searchList) ? searchList : [searchList];

  const markerVectorSource = new ol.source.Vector();
  const markerVectorLayer = new ol.layer.Vector({
    source: markerVectorSource,
    name: "markerLayer",
  });
  map.addLayer(markerVectorLayer);

  searchList.forEach((item) => {
    const { wgs84Lon, wgs84Lat, dutyName } = item;
    const markerCoords = ol.proj.fromLonLat([wgs84Lon, wgs84Lat]);

    // 마커 생성
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(markerCoords),
      name: "marker",
      data: item,
    });

    marker.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 25],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: "/images/location.png",
          scale: 0.07,
        }),
      })
    );

    markerVectorSource.addFeature(marker);

    // 팝업 오버레이 생성
    const popupOverlay = new ol.Overlay({
      positioning: "bottom-center",
      stopEvent: true,
      offset: [0, -10],
    });

    const popoverDiv = document.createElement("div");
    popoverDiv.className = "ol-popup-custom";
    popoverDiv.style.backgroundColor = "white";
    popoverDiv.style.padding = "5px 10px";
    popoverDiv.style.border = "1px solid #4096ff";
    popoverDiv.style.borderRadius = "4px";
    popoverDiv.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    popoverDiv.style.display = "flex";
    popoverDiv.style.alignItems = "center";

    const nameDiv = document.createElement("div");
    nameDiv.innerHTML = `<strong style="color: black;">${dutyName}</strong>`;
    nameDiv.style.marginRight = "10px";

    // 이름 클릭 이벤트 - 모달 창 띄우기
    nameDiv.addEventListener("click", () => showHospitalModal(item));

    // 마커 클릭 이벤트 - 모달 창 띄우기
    marker.on("click", () => showHospitalModal(item));

    const routeButton = document.createElement("button");
    routeButton.textContent = "길찾기";
    routeButton.style.backgroundColor = "#4096ff";
    routeButton.style.color = "white";
    routeButton.style.border = "none";
    routeButton.style.padding = "5px";
    routeButton.style.cursor = "pointer";
    routeButton.style.borderRadius = "4px";

    // 길찾기 버튼 클릭 이벤트
    routeButton.addEventListener("click", () => {
      if (myLocation) {
        // 선택된 마커와 팝업을 제외한 모든 마커와 팝업 제거
        markerVectorSource.getFeatures().forEach((feature) => {
          if (feature !== marker) {
            markerVectorSource.removeFeature(feature); // 선택된 마커 외 제거
          }
        });

        // 모든 팝업 오버레이 제거
        map.getOverlays().clear();

        // 선택된 팝업만 다시 추가
        map.addOverlay(popupOverlay);

        // 선택된 마커에 대해 길찾기 실행
        getRouteData(myLocation, { latitude: wgs84Lat, longitude: wgs84Lon });
      } else {
        alert("내 위치를 먼저 조회해주세요.");
      }
    });

    // 팝업에 이름과 길찾기 버튼 추가
    popoverDiv.appendChild(nameDiv);
    popoverDiv.appendChild(routeButton);

    popupOverlay.setElement(popoverDiv);
    map.addOverlay(popupOverlay);
    popupOverlay.setPosition(markerCoords);
  });

  // 모든 마커의 범위로 지도를 맞춤
  const extent = markerVectorSource.getExtent();
  map.getView().fit(extent, { padding: [100, 100, 100, 100] });
}



// 경로 데이터를 가져와 지도에 표시하고, 경로 정보를 routeInfoDiv에 업데이트
async function getRouteData(myLocation, destination) {
  try {
    const response = await fetch(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${myLocation.longitude},${myLocation.latitude}&destination=${destination.longitude},${destination.latitude}`,
      {
        headers: {
          Authorization: `KakaoAK bacf6d9a107d628abaf4e76e10a1409e`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch route data");
    }

    const data = await response.json();
    let routePoints = [];

    // 경로 데이터를 기반으로 좌표 추출
    const vertexes = data.routes[0].sections[0].roads.flatMap((road) => road.vertexes);
    for (let i = 0; i < vertexes.length; i += 2) {
      routePoints.push(ol.proj.fromLonLat([vertexes[i], vertexes[i + 1]]));
    }

    // 경로 라인 생성
    const routeLine = new ol.Feature({
      geometry: new ol.geom.LineString(routePoints),
      name: "routeLine",
    });

    routeLine.setStyle([
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "black",
          width: 7,
        }),
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "green",
          width: 4,
        }),
      }),
    ]);

    // 기존 경로 레이어 제거 후 새 경로 추가
    removeLayer("routeLayer");
    const routeVectorSource = new ol.source.Vector();
    const routeVectorLayer = new ol.layer.Vector({
      name: "routeLayer",
      source: routeVectorSource,
    });

    routeVectorSource.addFeature(routeLine);
    map.addLayer(routeVectorLayer);

    // 경로 정보 계산 (거리 및 예상 시간)
    const totalDistanceInKm = (data.routes[0].sections[0].distance / 1000).toFixed(2);
    const totalDurationInMinutes = Math.floor(data.routes[0].sections[0].duration / 60);
    const hours = Math.floor(totalDurationInMinutes / 60);
    const minutes = totalDurationInMinutes % 60;
    const totalTime = `${hours > 0 ? `${hours}시간 ` : ''}${minutes}분`;

    // 경로 정보 표시
    routeInfoDiv.style.display = "block";
    routeInfoDiv.innerHTML = `
      <strong>총 거리:</strong> ${totalDistanceInKm} km<br>
      <strong>도착 예상 시간:</strong> ${totalTime}
    `;

    // 경로의 범위에 맞게 지도 설정
    const routeExtent = routeVectorSource.getExtent();
    map.getView().fit(routeExtent, {
      padding: [100, 100, 100, 100],
      maxZoom: 16,
    });

  } catch (error) {
    console.error("Error fetching route data:", error);
  }
}



// 병상 가용 상태에 따른 CSS 클래스를 반환하는 함수
function getBedAvailabilityClass(available, total) {
  if (total === 0 || available === '-' || total === '-') return 'card-no-data';  // 데이터 없음 또는 사용 불가
  const rate = (available / total) * 100;

  if (rate <= 20) return 'card-busy';       // 혼잡 (빨강)
  if (rate <= 60) return 'card-normal';     // 보통 (노랑)
  return 'card-available';                  // 여유 (파랑)
}
// 병상 정보를 가로로 나열된 카드로 생성하는 함수
function createBedCardsSection(title, data) {
  const cards = data.map((bed) => {
    const [available, total] = bed.value.split('/').map(val => isNaN(Number(val)) ? '-' : Number(val));
    const cardClass = getBedAvailabilityClass(available, total);

    return `
      <div class="col-md-4 mb-3">
        <div class="card ${cardClass}">
          <div class="card-body text-center">
            <p class="card-title" style="font:14px;" >${bed.name}<p>
            <p class="card-text" style="font:14px;">${available}/${total}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <h6>${title}</h6>
    <div class="row">${cards}</div>
  `;
}

// 병원 상세 정보 표시 함수 수정
function showHospitalModal(item) {
  fetchHospitalData(item).then((data) => {
    const displayData = data || item;

    // 모달 헤더 설정
    document.getElementById('hospitalModalLabel').innerText = displayData.dutyName || '병원 정보';

    // 기본 정보 HTML 생성
    const modalBodyContent = `
          <div class="info-item">
              <p><strong>주소:</strong> ${item.dutyAddr || '-'}</p>
              <p><strong>응급실:</strong> ${displayData.dutyTel3 || '-'}</p>
              <p><strong>당직의:</strong> ${displayData.hv1 || '-'}</p>
              <p><strong>소아 당직의:</strong> ${displayData.hv12 || '-'}</p>
              <p><strong>최근 업데이트 시간:</strong> ${formatDate(displayData.hvidate) || '-'}</p>
          </div>
      `;

    // 장비 가용 여부 카드 생성
    const equipmentList = [
      { label: "CT 가용", available: displayData.hvctayn },
      { label: "MRI 가용", available: displayData.hvmriayn },
      { label: "혈관촬영기 가용", available: displayData.hvangioayn },
      { label: "조영촬영기 가용", available: displayData.hvangioayn },
      { label: "인공호흡기 가용", available: displayData.hvventiayn },
      { label: "인큐베이터 가용", available: displayData.hvincuayn },
      { label: "CRRT 가용", available: displayData.hvcrrtayn },
      { label: "ECMO 가용", available: displayData.hvecmoayn },
      { label: "고압산소치료기 가용", available: displayData.hvoxyayn },
      { label: "중심체온조절유도기 가용", available: displayData.hvhypoayn },
      { label: "구급차 가용", available: displayData.hvamyn }
    ];

    const equipmentAvailability = `
          <div class="card mb-3">
              <div class="card-header text-white" style="background-color: #001f3f;">
                  장비 가용 여부
              </div>
              <div class="card-body">
                  <ul class="list-group list-group-flush">
                      ${equipmentList.map(equipment => `
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                              ${equipment.label}
                              <span class="badge bg-${equipment.available === 'Y' ? 'success' : 'danger'}">
                                  ${equipment.available === 'Y' ? '사용 가능' : '사용 불가'}
                              </span>
                          </li>
                      `).join('')}
                  </ul>
              </div>
          </div>
      `;

    // 병상 정보 카드 생성
const bedCardsContent = `
<div class="d-flex justify-content-between align-items-center">
  <h5>병상 정보</h5>
  <div class="d-flex align-items-center">
    <span class="badge card-busy me-1">혼잡</span>
    <span class="badge card-normal me-1">보통</span>
    <span class="badge card-available me-1">여유</span>
    <span class="badge card-no-data">미제공</span>
  </div>
</div>
${createBedCardsSection('응급실', getEmergencyData(displayData))}
${createBedCardsSection('응급전용', getEmergencyExclusiveData(displayData))}
${createBedCardsSection('중환자실', getICUData(displayData))}
${createBedCardsSection('기타', getOtherData(displayData))}
`;


    // 모달 내용 삽입
    document.getElementById('modalBodyContent').innerHTML = modalBodyContent + equipmentAvailability + bedCardsContent;

    // 모달 표시
    const hospitalModal = new bootstrap.Modal(document.getElementById('hospitalModal'));
    hospitalModal.show();
  });
}

// 병상 정보 데이터 섹션 생성 함수
function createTableSection(title, data) {
  const rows = data.map(
    (item) => `<tr><td>${item.name}</td><td>${item.value}</td></tr>`
  ).join('');
  return `
    <h6>${title}</h6>
    <table class="table table-bordered">
      <thead><tr><th>종류</th><th>가용/전체(수)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
// 병상 정보 데이터 생성 함수들
function getEmergencyData(displayData) {
  return [
    { name: '일반(응급실일반병상)', value: `${displayData.hvec ?? '-'}/${displayData.hvs01 ?? '-'}` },
    { name: '코호트 격리', value: `${displayData.hv27 ?? '-'}/${displayData.hvs59 ?? '-'}` },
    { name: '음압 격리 병상', value: `${displayData.hv29 ?? '-'}/${displayData.hvs03 ?? '-'}` },
    { name: '일반 격리 병상', value: `${displayData.hv30 ?? '-'}/${displayData.hvs04 ?? '-'}` },
    { name: '소아', value: `${displayData.hv28 ?? '-'}/${displayData.hvs02 ?? '-'}` },
    { name: '소아 음압 격리', value: `${displayData.hv15 ?? '-'}/${displayData.hvs48 ?? '-'}` },
    { name: '소아일반격리', value: `${displayData.hv16 ?? '-'}/${displayData.hvs49 ?? '-'}` }
  ];
}

function getEmergencyExclusiveData(displayData) {
  return [
    { name: '중환자실 음압격리', value: `${displayData.hv17 ?? '-'}/${displayData.hvs50 ?? '-'}` },
    { name: '중환자실 일반격리', value: `${displayData.hv18 ?? '-'}/${displayData.hvs51 ?? '-'}` },
    { name: '입원실 음압격리', value: `${displayData.hv19 ?? '-'}/${displayData.hvs52 ?? '-'}` },
    { name: '입원실 일반격리', value: `${displayData.hv21 ?? '-'}/${displayData.hvs53 ?? '-'}` },
    { name: '중환자실', value: `${displayData.hv31 ?? '-'}/${displayData.hvs05 ?? '-'}` },
    { name: '소아중환자실', value: `${displayData.hv33 ?? '-'}/${displayData.hvs10 ?? '-'}` },
    { name: '입원실', value: `${displayData.hv36 ?? '-'}/${displayData.hvs19 ?? '-'}` },
    { name: '소아입원실', value: `${displayData.hv37 ?? '-'}/${displayData.hvs20 ?? '-'}` }
  ];
}

function getICUData(displayData) {
  return [
    { name: '일반', value: `${displayData.hvicc ?? '-'}/${displayData.hvs17 ?? '-'}` },
    { name: '내과', value: `${displayData.hv2 ?? '-'}/${displayData.hvs06 ?? '-'}` },
    { name: '외과', value: `${displayData.hv3 ?? '-'}/${displayData.hvs07 ?? '-'}` },
    { name: '흉부외과', value: `${displayData.hvccc ?? '-'}/${displayData.hvs16 ?? '-'}` },
    { name: '신경과', value: `${displayData.hvcc ?? '-'}/${displayData.hvs11 ?? '-'}` },
    { name: '신경외과', value: `${displayData.hv6 ?? '-'}/${displayData.hvs12 ?? '-'}` },
    { name: '외상', value: `${displayData.hv9 ?? '-'}/${displayData.hvs14 ?? '-'}` },
    { name: '화상', value: `${displayData.hv8 ?? '-'}/${displayData.hvs13 ?? '-'}` },
    { name: '소아', value: `${displayData.hv32 ?? '-'}/${displayData.hvs09 ?? '-'}` },
    { name: '신생아', value: `${displayData.hvncc ?? '-'}/${displayData.hvs08 ?? '-'}` },
    { name: '심장내과', value: `${displayData.hv34 ?? '-'}/${displayData.hvs15 ?? '-'}` },
    { name: '음압격리', value: `${displayData.hv35 ?? '-'}/${displayData.hvs18 ?? '-'}` }
  ];
}

function getOtherData(displayData) {
  return [
    { name: '일반', value: `${displayData.hvgc ?? '-'}/${displayData.hvs38 ?? '-'}` },
    { name: '음압격리', value: `${displayData.hv41 ?? '-'}/${displayData.hvs25 ?? '-'}` },
    { name: '정신과 폐쇄병동', value: `${displayData.hv40 ?? '-'}/${displayData.hvs24 ?? '-'}` },
    { name: '분만실', value: `${displayData.hv42 ?? '-'}/${displayData.hvs26 ?? '-'}` },
    { name: '수술실', value: `${displayData.hvoc ?? '-'}/${displayData.hvs22 ?? '-'}` }
  ];
}

// 장비 가용 여부 항목 생성 함수
function createAvailabilityItem(label, available) {
  return `<li>${label}: ${available === 'Y' ? 'Y' : 'N'}</li>`;
}



// 날짜 포맷 함수
function formatDate(date) {
  if (!date) return "-";
  const dateStr = String(date);
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(8, 10);
  const minute = dateStr.slice(10, 12);

  return `${year}.${month}.${day} ${hour}:${minute}`;
}
async function fetchHospitalData(data) {
  try {
    const serviceKey = "";
    const { sidoData, sigunguData } = extractSidoSigungu(data.dutyAddr);
    const params = new URLSearchParams({
      STAGE1: sidoData,
      STAGE2: sigunguData,
      pageNo: 1,
      numOfRows: 999,
    });

    const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=${serviceKey}&${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json", // JSON 형식의 응답을 요청
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonData = await response.json();

    // API 응답 구조에 따라 데이터를 추출
    if (jsonData && jsonData.response && jsonData.response.body && jsonData.response.body.items && jsonData.response.body.items.item) {
      const items = jsonData.response.body.items.item;
      if (items.length < 1) {
        alert("해당 병원의 실시간 응급실 정보가 존재하지 않습니다.");
    } else if (items.length == 0) {
        if (items.hpid === data.hpid) {
          return items; // 병원 데이터를 반환
        } else {
            alert("해당 병원의 실시간 응급실 정보가 존재하지 않습니다.");
        }
    } else {
        for (const item of items) {
            if (item.hpid === data.hpid) {
              return item; // 병원 데이터를 반환
            }
        }
    }
    
      
    } else {
      console.error("Unexpected data format:", jsonData);
      return null; // 데이터가 없을 경우 null 반환
    }
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    return null;
  }
}


async function getAIAnswer() {
  const usr_lat = myLocation.latitude;
  const usr_lon = myLocation.longitude;
  const question = document.getElementById('aiInput').value;

  const API_KEY = ""; // OpenAI API 키 입력
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  if (!question.trim()) return; // 질문이 비어있으면 아무 작업도 하지 않음

  // 외부 API를 통해 병원 정보 조회
  let hospitals = null;
  if (usr_lat && usr_lon) {
    hospitals = await getNearbyHospitals(usr_lat, usr_lon);
  }

  const defaultQuestion = `
  너는 대한민국 전국 응급의료기관 정보 조회 서비스에서 사용되는 API 역할을 한다. 사용자가 증상과 병명을 입력하면 다음과 같은 방식으로 응답해야 한다:

  1. 사용자의 증상을 바탕으로 가능한 병명을 추측하여 제시해야 한다. 추측한 병명과 함께 그 이유도 설명한다.
  2. 사용자의 위치 정보는 다음과 같다
  { "usr_location" : {
      "usr_lon": ${usr_lon},
      "usr_lat": ${usr_lat} 
  }}
  다음 사용자 위치정보(usr_location)를 사용해 근처 5병원의 이름과 좌표를 알려줘야 한다. 단, 사용자의 위치 정보(usr_lon, usr_lat) null인 경우 근처 병원을 추천하지 않고, 병원 정보는 null로 응답한다.
  3. 사용자의 입력이 병명이나 증상과 관련되지 않은 경우, "병명이나 증상을 입력해주세요."라고 응답한다.
  4. 사용자가 증상을 설명했음에도 추측하기 어렵다면 "해당 증상 만으로는 병명을 파악하기 어렵습니다. 더 자세히 설명해주세요" 라고 응답한다.
  응답은 **JSON 형식**이어야 하며, 다음과 같은 구조를 따른다:

  {
      "result": {
          "message": "{추측한 병명과 이유만 작성한다.}",
          "medical": ${hospitals ? JSON.stringify(hospitals) : "null"}
      }
  }

  사용자가 입력한 내용: ${question}
  `;

  console.log(defaultQuestion);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: defaultQuestion }],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.choices && result.choices[0].message.content) {
        try {
          const jsonResponse = JSON.parse(result.choices[0].message.content);
          const aiResponse = document.getElementById('aiResponse');
          console.log(jsonResponse);
          console.log(typeof jsonResponse);

          aiResponse.innerHTML = jsonResponse.result.message;

          // 병원 정보 표시
          if (jsonResponse.result.medical) {
            const hospitalsList = jsonResponse.result.medical.map(hospital => `
              <li>${hospital.name} (위도: ${hospital.lat}, 경도: ${hospital.lon})</li>
            `).join('');

            // 병원 마커 지도에 추가
            addAIHospitalMarkers(jsonResponse.result.medical);
          }
        } catch (parseError) {
          console.error("JSON 파싱 오류:", parseError);
          document.getElementById('aiResponse').innerHTML = "응답 데이터를 처리하는 중 오류가 발생했습니다.";
        }
      } else {
        console.log("응답 받은 값이 없음.");
      }
    } else {
      console.error("Error response from API:", response.statusText);
    }

  } catch (error) {
    console.error("Error calling ChatGPT API", error);
  } finally {
    document.getElementById('loadingBtn').style.display = 'none';
    document.getElementById('aiBtn').style.display = 'block';
  }
}



function extractSidoSigungu(dutyAddr) {
  const addrParts = dutyAddr.split(' ');

  const sidoData = addrParts[0];
  const sigunguData = addrParts[1];

  return { sidoData, sigunguData };
}


async function getNearbyHospitals(lat, lon) {
  const radius = 5000; // 반경 5km
  const overpassUrl = "https://overpass-api.de/api/interpreter";
  
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      relation["amenity"="hospital"](around:${radius},${lat},${lon});
    );
    out center;
  `;
  
  try {
    const response = await fetch(overpassUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `data=${encodeURIComponent(query)}`
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.elements.slice(0, 5).map(element => ({
        name: element.tags.name || "이름 정보 없음",
        lon: element.type === "node" ? element.lon : element.center.lon,
        lat: element.type === "node" ? element.lat : element.center.lat,
      }));
    } else {
      console.error("Overpass API 에러:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("병원 데이터 조회 중 오류:", error);
    return null;
  }
}

function addAIHospitalMarkers(hospitals) {
  removeAllLayer();
  const aiHospitalVectorSource = new ol.source.Vector();
  const aiHospitalVectorLayer = new ol.layer.Vector({
    source: aiHospitalVectorSource,
    name: "aiHospitalLayer",
  });
  map.addLayer(aiHospitalVectorLayer);

  hospitals.forEach(hospital => {
    const { name, lon, lat } = hospital;
    const markerCoords = ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]);

    const marker = new ol.Feature({
      geometry: new ol.geom.Point(markerCoords),
      name: "aiHospitalMarker",
      data: hospital,
    });

    marker.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: "/images/location.png",
          scale: 0.05,
        }),
      })
    );

    // 팝업 오버레이 생성
    const popupOverlay = new ol.Overlay({
      positioning: "bottom-center",
      stopEvent: true,
      offset: [0, -10],
    });

    const popoverDiv = document.createElement("div");
    popoverDiv.className = "ol-popup-custom";
    popoverDiv.style.backgroundColor = "white";
    popoverDiv.style.padding = "5px 10px";
    popoverDiv.style.border = "1px solid #4096ff";
    popoverDiv.style.borderRadius = "4px";
    popoverDiv.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    popoverDiv.style.display = "flex";
    popoverDiv.style.alignItems = "center";

    const nameDiv = document.createElement("div");
    nameDiv.innerHTML = `<strong style="color: black;">${name}</strong>`;
    nameDiv.style.marginRight = "10px";

    const routeButton = document.createElement("button");
    routeButton.textContent = "길찾기";
    routeButton.style.backgroundColor = "#4096ff";
    routeButton.style.color = "white";
    routeButton.style.border = "none";
    routeButton.style.padding = "5px";
    routeButton.style.cursor = "pointer";
    routeButton.style.borderRadius = "4px";

    // 길찾기 버튼 클릭 이벤트
    routeButton.addEventListener("click", () => {
      if (myLocation) {
        // 선택된 마커와 팝업을 제외한 모든 마커와 팝업 제거
        aiHospitalVectorSource.getFeatures().forEach((feature) => {
          if (feature !== marker) {
            aiHospitalVectorSource.removeFeature(feature); // 선택된 마커 외 제거
          }
        });

        // 모든 팝업 오버레이 제거
        map.getOverlays().clear();

        // 선택된 팝업만 다시 추가
        map.addOverlay(popupOverlay);

        // 선택된 마커에 대해 길찾기 실행
        getRouteData(myLocation, { latitude: lat, longitude: lon });
      } else {
        alert("내 위치를 먼저 조회해주세요.");
      }
    });

    popoverDiv.appendChild(nameDiv);
    popoverDiv.appendChild(routeButton);

    popupOverlay.setElement(popoverDiv);
    map.addOverlay(popupOverlay);
    popupOverlay.setPosition(markerCoords);
    aiHospitalVectorSource.addFeature(marker);
  });

  // 모든 마커의 범위로 지도를 맞춤
  const extent = aiHospitalVectorSource.getExtent();
  map.getView().fit(extent, { padding: [100, 100, 100, 100] });
}



// 지도 모든레이어 삭제
function removeAllLayer() {
  removeLayer("markerLayer");
  removeLayer("routeLayer");
  removeLayer("aiHospitalLayer");
  routeInfoDiv.style.display = 'none';
}