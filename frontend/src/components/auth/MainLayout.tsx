import { Link, Outlet, useNavigate } from "react-router-dom";

interface MainLayoutProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export default function MainLayout({ token, setToken }: MainLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <nav style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/search" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>
          🏠 할 일 & 다이어리 홈
        </Link>
        {token && (
          <button onClick={handleLogout} style={{ padding: "5px 10px", cursor: "pointer" }}>
            로그아웃
          </button>
        )}
      </nav>
      
      <Outlet />
    </div>
  );
}
