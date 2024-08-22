import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');

    useEffect(() => {
        // 백엔드에서 데이터 가져오기
        axios.get('/api/tests')
            .then(response => {
                setName(response.data); // 받아온 데이터를 상태에 저장
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            백엔드에서 가져온 이름입니다: {name}
        </div>
    );
}

export default App;
