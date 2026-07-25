import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

interface SearchPageProps {
  token: string;
}

// 백엔드 QueryDSL 검색 결과 DTO 구조에 맞춘 타입 선언
interface TodoSearchResponse {
  id: number;
  type: "TODO" | "DIARY"; // 할 일인지 다이어리인지 구분값
  title: string;
  content: string;
  createdAt: string;
}

export default function SearchPage({ token }: SearchPageProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TodoSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔍 가로챈 자체 JWT를 Authorization 헤더에 Bearer 타입으로 담아 전송
      const response = await axios.get(`${API_BASE_URL}/api/todos/search`, {
        params: { keyword: searchKeyword },
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      
      // 백엔드가 반환한 QueryDSL 결과 리스트를 상태에 저장
      setSearchResults(response.data);
    } catch (error: any) {
      console.error("QueryDSL 동적 검색 실패:", error);
      alert("데이터를 불러오지 못했습니다: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <fieldset style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc", background: "#f9f9f9" }}>
      <legend style={{ fontWeight: "bold", fontSize: "1.1rem", padding: "0 10px" }}>
        🔍 QueryDSL 할 일 / 다이어리 동적 통합 검색
      </legend>
      
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <input
          type="text"
          placeholder="검색어를 입력하세요 (예: 자바 공부, 오늘 일기...)"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: "10px 20px", cursor: "pointer", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}
        >
          {isLoading ? "검색 중..." : "검색"}
        </button>
      </form>

      {/* 실시간 데이터 바인딩 창 */}
      <div style={{ marginTop: "25px" }}>
        <h3 style={{ borderBottom: "2px solid #007bff", paddingBottom: "5px", marginBottom: "15px" }}>
          검색 결과 ({searchResults.length}건)
        </h3>
        
        {searchResults.length === 0 ? (
          <p style={{ color: "#888", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
            {searchKeyword ? "검색 조건과 일치하는 내역이 없습니다." : "검색어를 입력하고 버튼을 눌러보세요."}
          </p>
        ) : (
          <ul style={{ paddingLeft: "0", listStyle: "none" }}>
            {searchResults.map((item) => (
              <li 
                key={`${item.type}-${item.id}`} 
                style={{ 
                  padding: "12px", 
                  marginBottom: "10px", 
                  borderRadius: "6px", 
                  border: "1px solid #eee", 
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  {/* 타입에 따른 뱃지 분기 처리 */}
                  <span style={{ 
                    padding: "3px 8px", 
                    borderRadius: "4px", 
                    fontSize: "11px", 
                    fontWeight: "bold",
                    color: "#fff",
                    background: item.type === "TODO" ? "#28a745" : "#17a2b8"
                  }}>
                    {item.type === "TODO" ? "할 일" : "다이어리"}
                  </span>
                  <span style={{ color: "#aaa", fontSize: "12px" }}>{item.createdAt}</span>
                </div>
                <h4 style={{ margin: "5px 0", color: "#333" }}>{item.title}</h4>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </fieldset>
  );
}
