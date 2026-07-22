import axios from 'axios';

//백엔드 서버 주소 설정
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL : API_BASE_URL,
    headers : {
        'Content-Type' : 'application/json',
    },
});

//요청 인터셉터 : LocalStorage에서 토큰을 읽어 Authorization 헤더에 자동 주입
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;