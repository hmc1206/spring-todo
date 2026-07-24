import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

interface SearchPageProps {
  token: string;
}

export default function SearchPage({ token }: SearchPageProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/api/todos/search`, {
        params: { keyword: searchKeyword },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("검색 실패:", error);
      alert("데이터를 불러오지 못했습니다.");
    }
  };

  return (
    <fieldset style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ccc" }}>
      <legend style={{ fontWeight: "bold" }}>🔍 QueryDSL 동적 검색</legend>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          placeholder="할 일 또는 다이어리 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 15px", cursor: "pointer" }}>검عه</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h4>검색 결과 ({searchResults.length}건)</h4>
        {searchResults.length === 0 ? (
          <p style={{ color: "#888", fontSize: "14px" }}>결과가 없습니다.</p>
        ) : (
          <ul style={{ paddingLeft: "20px" }}>
            {searchResults.map((item: any) => (
              <li key={item.id} style={{ marginBottom: "8px" }}>
                <strong>[{item.type || "데이터"}]</strong> {item.title || item.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </fieldset>
  );
}
