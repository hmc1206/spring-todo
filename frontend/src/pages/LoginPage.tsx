import { GoogleLogin } from "@react-oauth/google";
// verbatimModuleSyntax 대응을 위한 타입 전용 임포트
import type { CredentialResponse } from "@react-oauth/google"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

interface LoginPageProps {
  setToken: (token: string) => void;
}

export default function LoginPage({ setToken }: LoginPageProps) {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    try {
      // 🔍 백엔드 request.get("token") 스펙에 정확히 맞추어 "token" 키값으로 전송!
      const response = await axios.post(`${API_BASE_URL}/api/users/google`, {
        token: idToken, 
      });

      // 🔍 백엔드가 반환하는 Map.of("accessToken", jwtToken) 스펙에 맞춰 수신!
      const jwtToken = response.data.accessToken;
      
      if (jwtToken) {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
        alert("성공적으로 로그인되었습니다!");
        navigate("/search"); // 🏠 인증 성공 즉시 QueryDSL 동적 검색 페이지로 진입
      }
    } catch (error: any) {
      console.error("백엔드 인증 실패:", error);
      alert("인증 실패: " + (error.response?.data?.error || error.message));
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
        />
      </div>
    </div>
  );
}

