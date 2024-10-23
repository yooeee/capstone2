import React, { useState } from "react";
import { Input, Button, Spin, Alert } from "antd";
import axios from "axios";

const { TextArea } = Input;

const ChatGPT = ({ myLocation2 }) => {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        console.log(myLocation2);
        const API_KEY = ""; // 여기에 OpenAI API 키를 입력하세요
        const apiUrl = "https://api.openai.com/v1/chat/completions";
        const defaultQuestion = `
        너는 대한민국 전국 응급의료기관 정보 조회 서비스에서 사용되는 API 역할을 한다. 사용자가 증상과 병명을 입력하면 다음과 같은 방식으로 응답해야 한다:

        1. 사용자의 증상을 바탕으로 가능한 병명을 추측하여 제시해야 한다. 추측한 병명과 함께 그 이유도 설명한다.
        2. 사용자의 위치 정보 (userLocation=${myLocation2})를 사용해 근처 병원의 이름과 좌표를 알려줘야 한다. 단, 사용자의 위치 정보가 null인 경우 근처 병원을 추천하지 않고, 병원 정보는 null로 응답한다.
        3. 사용자의 입력이 병명이나 증상과 관련되지 않은 경우, "병명이나 증상을 입력해주세요."라고 응답한다.
        4. 사용자가 증상을 설명했음에도 추측하기 어렵다면 "해당증상 만으로는 병명을 파악하기 어렵습니다. 더 자세히 설명해주세요" 라고 응답한다.
        응답은 **JSON 형식**이어야 하며, 다음과 같은 구조를 따른다:

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
        console.log(defaultQuestion);
        if (!question.trim()) return; // 질문이 비어있으면 아무 작업도 하지 않음

        setLoading(true); // 로딩 상태 시작
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
            if(result.data.choices[0].message.content){
                const jsonResponse = JSON.parse(result.data.choices[0].message.content);
            
                console.log(jsonResponse);
                console.log(typeof jsonResponse)
                setResponse(jsonResponse.result.message);
            } else{
                console.log("응답 받은값이 없음.");
            }
        
        } catch (error) {
            console.error("Error calling ChatGPT API", error);
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8%'} }>
            <div style={{ width: "100%", maxWidth: "600px", maxHeight : "300px" }}>
                {response && (
                    <Alert 
                        description={response}
                        type="info"
                        style={{ marginBottom: "20px", maxHeight: '150px', overflowY: 'auto'}}
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
