import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import MainLayout from "./components/auth/MainLayout";

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  return (
    <Routes>
      <Route 
        path="/login" 
        element={token ? <Navigate to="/search" replace /> : <LoginPage setToken={setToken} />} 
      />

      <Route element={<MainLayout token={token} setToken={setToken} />}>
        <Route 
          path="/search" 
          element={token ? <SearchPage token={token} /> : <Navigate to="/login" replace />} 
        />
      </Route>

      <Route 
        path="*" 
        element={token ? <Navigate to="/search" replace /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}
