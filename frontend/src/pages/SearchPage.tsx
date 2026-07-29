import React, { useState, useEffect } from "react";
import axios from "axios";

// 🛠️ Vite 환경 변수 격리 설계 반영
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface SearchPageProps {
  token: string;
}

interface TodoSearchResponse {
  id: number;
  type: "TODO" | "DIARY"; 
  title: string;
  content: string;
  createdAt: string;
  isCompleted?: boolean; // 할 일 완료 상태 토글용 확장
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
  const [emotion, setEmotion] = useState<string>("HAPPY"); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 최초 전체 데이터 로드
  useEffect(() => {
    fetchData();
  }, []);

  // 오늘 날짜 포맷팅 (YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // [POST] 데이터 안전 등록 함수 (보안 강화)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert("내용을 입력해 주세요.");
    if (dataType === "DIARY" && !title.trim()) return alert("다이어리 제목을 입력해 주세요.");

    setIsSubmitting(true);
    try {
      const todayDate = getTodayDateString();
      const targetUrl = dataType === "TODO" ? `${API_BASE_URL}/api/todos` : `${API_BASE_URL}/api/diaries`;
      
      const requestBody = dataType === "TODO" 
        ? { content, date: todayDate } 
        : { title, content, date: todayDate, emotion };

      await axios.post(targetUrl, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`${dataType === "TODO" ? "할 일" : "다이어리"}이(가) 등록되었습니다!`);
      setTitle("");
      setContent("");
      fetchData();
    } catch (error: any) {
      alert("등록 실패: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔄 [미션 1] [PATCH] 할 일 완료 상태 반전 토글 함수
  const handleToggleTodoComplete = async (id: number) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/todos/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 상태 목록에서 해당 아이템만 찾아 실시간 반전 (불변성 유지)
      setSearchResults((prev) =>
        prev.map((item) =>
          item.type === "TODO" && item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
    } catch (error: any) {
      alert("상태 변경 실패: " + (error.response?.data?.message || error.message));
    }
  };

  // [DELETE] 할 일 삭제 함수
  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm("이 할 일을 정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("성공적으로 삭제되었습니다.");
      fetchData();
    } catch (error: any) {
      alert("삭제 실패: " + (error.response?.data?.message || error.message));
    }
  };

  // 🗑️ [미션 2] [DELETE] 다이어리 삭제 함수
  const handleDeleteDiary = async (id: number) => {
    if (!window.confirm("이 다이어리를 정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/diaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("다이어리가 성공적으로 삭제되었습니다.");
      fetchData();
    } catch (error: any) {
      alert("삭제 실패: " + (error.response?.data?.message || error.message));
    }
  };

  // [GET] QueryDSL 동적 통합 검색 함수
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
      
      {/* ➕ [PART 1] 데이터 등록 패널 */}
      <fieldset style={{ padding: "20px", borderRadius: "8px", border: "1px solid #007bff", background: "#f4f9ff" }}>
        <legend style={{ fontWeight: "bold", fontSize: "1.1rem", padding: "0 10px", color: "#007bff" }}>
          ➕ 새 데이터 추가하기 (보안 연동)
        </legend>
        
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
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

          {dataType === "DIARY" && (
            <input
              type="text"
              placeholder="다이어리 제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" }}
            />
          )}

          <textarea
            placeholder={dataType === "TODO" ? "오늘의 할 일 내용을 입력하세요..." : "오늘의 일기 내용을 입력하세요..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", resize: "none", fontFamily: "sans-serif" }}
          />

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

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ padding: "10px", cursor: "pointer", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "14px" }}
          >
            {isSubmitting ? "저장 중..." : `${dataType === "TODO" ? "할 일" : "다이어리"} 안전하게 저장`}
          </button>
        </form>
      </fieldset>

      {/* 🔍 [PART 2] QueryDSL 동적 통합 검색 결과 패널 */}
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
                <li key={`${item.type}-${item.id}`} style={{ padding: "12px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #eee", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", color: "#fff", background: item.type === "TODO" ? "#28a745" : "#17a2b8" }}>
                        {item.type === "TODO" ? "할 일" : "다이어리"}
                      </span>
                      
                      {/* [미션 1] 할 일 타입 한정 실시간 완료 토글 체크박스 */}
                      {item.type === "TODO" && (
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", cursor: "pointer" }}>
                          <input type="checkbox" checked={!!item.isCompleted} onChange={() => handleToggleTodoComplete(item.id)} />
                          완료
                        </label>
                      )}
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#aaa", fontSize: "12px" }}>{item.createdAt}</span>
                      
                      {/* [미션 2] 다이어리 삭제 기능 추가 및 다형성 바인딩 처리 */}
                      <button 
                        onClick={() => item.type === "TODO" ? handleDeleteTodo(item.id) : handleDeleteDiary(item.id)}
                        style={{ padding: "3px 8px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <h4 style={{ margin: "5px 0", color: "#333" }}>{item.title || "할 일 상세 내역"}</h4>
                  
                  {/* 완료 여부에 따른 동적 취소선/투명도 스타일 매핑 */}
                  <p style={{ 
                    margin: "0", color: "#666", fontSize: "14px",
                    textDecoration: item.type === "TODO" && item.isCompleted ? "line-through" : "none",
                    opacity: item.type === "TODO" && item.isCompleted ? 0.5 : 1
                  }}>
                    {item.content}
                  </p>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>
    </div>
  );
} // 파일 끝 마감 감싸기
