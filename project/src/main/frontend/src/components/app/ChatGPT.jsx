// ChatGPT.jsx
import React, { useState } from "react";
import { Input, Button, Spin, Alert } from "antd";
import axios from "axios";

const { TextArea } = Input;

const ChatGPT = ({ myLocation2, setHospitalLocation }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {

    const usr_lat = myLocation2?.latitude || null;
    const usr_lon = myLocation2?.longitude || null;

    const API_KEY = ""; // OpenAI API 키를 환경 변수로 관리하는 것을 권장합니다.
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const defaultQuestion = `
    너는 대한민국 전국 응급의료기관 정보 조회 서비스에서 사용되는 API 역할을 한다. 사용자가 증상과 병명을 입력하면 다음과 같은 방식으로 응답해야 한다:

    1. 사용자의 증상을 바탕으로 가능한 병명을 추측하여 제시해야 한다. 추측한 병명과 함께 그 이유도 설명한다.
    2. 사용자의 위치 정보는 다음과 같다
    { "usr_location" : {
        "usr_lon": ${usr_lon},
        "usr_lat": ${usr_lat} 
    }
        다음 사용자 위치정보(usr_location) 사용해 근처 병원의 이름과 좌표를 알려줘야 한다. 단, 사용자의 위치 정보(usr_lon, usr_lat) null인 경우 근처 병원을 추천하지 않고, 병원 정보는 null로 응답한다.
    3. 사용자의 입력이 병명이나 증상과 관련되지 않은 경우, "병명이나 증상을 입력해주세요."라고 응답한다.
    4. 사용자가 증상을 설명했음에도 추측하기 어렵다면 "해당증상 만으로는 병명을 파악하기 어렵습니다. 더 자세히 설명해주세요" 라고 응답한다.
    응답은 **JSON 형식**이어야 하며, 다음과 같은 구조를 따른다:
    5. 병원은 실제 데이터이어야 한다. 너가 학습을 했든 데이터를 찾아내서든 현재 사용자 위치 10KM 기반 이내에 있는 실제 병원 이름과 경도, 위도를 반드시 알아낸다.
    {
        "result": {
        "message": "{추측한 병명과 이유}",
        "medical": {
            "name": "{병원 이름}",
            "lon": "{병원의 경도}",
            "lat": "{병원의 위도}"
        }
        }
    }

    사용자가 입력한 내용:`;

    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await axios.post(
        apiUrl,
        {
          model: "gpt-4",
          messages: [{ role: "user", content: defaultQuestion + question }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      if (result.data.choices[0].message.content) {
        const jsonResponse = JSON.parse(result.data.choices[0].message.content);
       
        setResponse(jsonResponse.result.message);

        // 추가: 병원 위치 정보를 업데이트
        if (jsonResponse.result.medical && jsonResponse.result.medical.lat && jsonResponse.result.medical.lon) {
            console.log("====사용자위치====")
            console.log(usr_lat);
            console.log(usr_lon);
            console.log("========병원위치==========")
            console.log(jsonResponse.result.medical.lat);
            console.log(jsonResponse.result.medical.lon);
          setHospitalLocation({
            latitude: parseFloat(jsonResponse.result.medical.lat),
            longitude: parseFloat(jsonResponse.result.medical.lon),
            name: jsonResponse.result.medical.name,
          });
        } else {
          // 병원 정보가 없을 경우 상태를 null로 설정
          setHospitalLocation(null);
        }
      } else {
        console.log("응답 받은 값이 없음.");
      }
    } catch (error) {
      console.error("Error calling ChatGPT API", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "8%" }}>
      <div style={{ width: "100%", maxWidth: "600px", maxHeight: "300px" }}>
        {response && (
          <Alert
            description={response}
            type="info"
            style={{ marginBottom: "20px", maxHeight: "150px", overflowY: "auto" }}
          />
        )}
        <TextArea
          placeholder="AI에게 증상을 입력해보세요."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ width: "100%" }}
          disabled={loading || question.trim() === ""}
        >
          {loading ? <Spin /> : "질문하기"}
        </Button>
      </div>
    </div>
  );
};

export default ChatGPT;
