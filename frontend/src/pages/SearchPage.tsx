import React, { useState, useEffect } from "react";
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
  // --- [공통 상태 관리] ---
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TodoSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- [데이터 추가 전용 상태 관리] ---
  const [dataType, setDataType] = useState<"TODO" | "DIARY">("TODO");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [emotion, setEmotion] = useState<string>("HAPPY"); // 다이어리용 기본 감정값
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 컴포넌트 마운트 시 최초 1회 전체 데이터를 불러오기 위한 이펙트
  useEffect(() => {
    fetchData();
  }, []);

  // 오늘 날짜를 YYYY-MM-DD 포맷의 문자열로 추출 (백엔드 LocalDate 매핑용)
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 1. [정석 아키텍처 반영] 데이터 추가(등록) 함수
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }
    if (dataType === "DIARY" && !title.trim()) {
      alert("다이어리 제목을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const todayDate = getTodayDateString();
      const targetUrl = dataType === "TODO" ? `${API_BASE_URL}/api/todos` : `${API_BASE_URL}/api/diaries`;
      
      // 🔍 [보안 고도화] 더 이상 요청 바디(RequestBody)에 위조 위험이 있는 수동 userId를 싣지 않습니다.
      let requestBody = {};

      if (dataType === "TODO") {
        // 🟩 TodoRequestDto 규격 매싱 (content, date 필수 / userId 탈락)
        requestBody = {
          content: content,
          date: todayDate,
        };
      } else {
        // 🟦 DiaryRequestDto 규격 매싱 (title, content, date 필수, emotion 선택 / userId 탈락)
        requestBody = {
          title: title,
          content: content,
          date: todayDate,
          emotion: emotion,
        };
      }

      // 🔍 오직 Authorization 헤더의 JWT(token)만 믿고 백엔드로 전송합니다.
      await axios.post(targetUrl, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`${dataType === "TODO" ? "할 일" : "다이어리"}이(가) 안전한 토큰 인증을 거쳐 등록되었습니다!`);
      
      // 입력 폼 초기화
      setTitle("");
      setContent("");
      
      // 등록 완료 후 실시간 리스트 갱신
      fetchData();
    } catch (error: any) {
      console.error("데이터 추가 실패:", error);
      alert("등록 실패: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. QueryDSL 동적 검색 및 리스트 조회 함수
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/todos/search`, {
        params: { keyword: searchKeyword },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error: any) {
      console.error("QueryDSL 동적 검색 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      
      {/* ➕ [PART 1] 백엔드 DTO 최적화 및 JWT 토큰 기반 입력 패널 */}
      <fieldset style={{ padding: "20px", borderRadius: "8px", border: "1px solid #007bff", background: "#f4f9ff" }}>
        <legend style={{ fontWeight: "bold", fontSize: "1.1rem", padding: "0 10px", color: "#007bff" }}>
          ➕ 새 데이터 추가하기 (보안 연동)
        </legend>
        
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
          {/* 타입 선택 라디오 버튼 */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>종류 선택 :</label>
            <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="radio" name="dataType" checked={dataType === "TODO"} onChange={() => setDataType("TODO")} />
              🟩 할 일 (Todo)
            </label>
            <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="radio" name="dataType" checked={dataType === "DIARY"} onChange={() => setDataType("DIARY")} />
              🟦 다이어리 (Diary)
            </label>
          </div>

          {/* 제목 입력 - 다이어리(DIARY)일 때만 활성화 (Todo는 title 필드가 없으므로 차단) */}
          {dataType === "DIARY" && (
            <input
              type="text"
              placeholder="다이어리 제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" }}
            />
          )}

          {/* 내용 입력 */}
          <textarea
            placeholder={dataType === "TODO" ? "오늘의 할 일 내용을 입력하세요..." : "오늘의 일기 내용을 입력하세요..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", resize: "none", fontFamily: "sans-serif" }}
          />

          {/* 다이어리일 때만 노출되는 감정 선택(Emotion) UI */}
          {dataType === "DIARY" && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
              <label style={{ fontWeight: "bold" }}>오늘의 감정:</label>
              <select value={emotion} onChange={(e) => setEmotion(e.target.value)} style={{ padding: "5px" }}>
                <option value="HAPPY">😀 기쁨</option>
                <option value="SAD">😭 슬픔</option>
                <option value="ANGRY">😡 화남</option>
              </select>
            </div>
          )}

          {/* 등록 버튼 */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ padding: "10px", cursor: "pointer", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "14px" }}
          >
            {isSubmitting ? "저장 중..." : `${dataType === "TODO" ? "할 일" : "다이어리"} 안전하게 저장`}
          </button>
        </form>
      </fieldset>

      {/* 🔍 [PART 2] QueryDSL 할 일 / 다이어리 동적 통합 검색 패널 */}
      <fieldset style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc", background: "#f9f9f9" }}>
        <legend style={{ fontWeight: "bold", fontSize: "1.1rem", padding: "0 10px" }}>
          🔍 QueryDSL 동적 통합 검색
        </legend>
        
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <input
            type="text"
            placeholder="검색어를 입력하세요 (내용 또는 다이어리 제목)..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" }}
          />
          <button type="submit" disabled={isLoading} style={{ padding: "10px 20px", cursor: "pointer", background: "#333", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}>
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </form>

        {/* 실시간 데이터 바인딩 결과창 */}
        <div style={{ marginTop: "25px" }}>
          <h3 style={{ borderBottom: "2px solid #333", paddingBottom: "5px", marginBottom: "15px" }}>
            검색 결과 ({searchResults.length}건)
          </h3>
          
          {searchResults.length === 0 ? (
            <p style={{ color: "#888", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
              데이터를 등록하거나 다른 검색어를 입력해 보세요.
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
                  {/* Todo 타입일 때는 title이 존재하지 않으므로 기본 텍스트 처리 및 안전 렌더링 */}
                  <h4 style={{ margin: "5px 0", color: "#333" }}>{item.title || "할 일 상세 내역"}</h4>
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>{item.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

    </div>
  );
}
