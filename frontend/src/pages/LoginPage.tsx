import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

interface LoginPageProps {
  setToken: (token: string) => void;
}

export default function LoginPage({ setToken }: LoginPageProps) {
  const navigate = useNavigate();

  // 📁 frontend/src/pages/LoginPage.tsx 내부 handleGoogleSuccess 수정

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    try {
        // 🔍 백엔드 UserRequestDto의 loginId 필드에 구글 ID 토큰을 실어서 전송합니다!
        const response = await axios.post(`${API_BASE_URL}/api/users/google`, {
        loginId: idToken, 
        password: "",    // 백엔드 파라미터 누락 에러 방지용 공백 주입
        nickname: ""
        });

        const jwtToken = response.data.token || response.data.accessToken;
        if (jwtToken) {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
        alert("성공적으로 로그인되었습니다!");
        navigate("/search"); // 🏠 QueryDSL 동적 검색 페이지로 진입!
        }
    } catch (error: any) {
        console.error("백엔드 인증 실패:", error);
        alert("인증 실패: " + (error.response?.data?.message || error.message));
    }
    };


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Sign In</h2>
      <p style={{ color: "#666" }}>구글 계정으로 간편하게 시작하세요.</p>
      <div style={{ display: "inline-block", marginTop: "20px" }}>
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={() => alert("구글 로그인 실패")} 
          useOneTap
        />
      </div>
    </div>
  );
}
