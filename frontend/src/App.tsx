import { Link, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <nav>
        <Link to="/login">
          로그인
        </Link>

        {" | "}

        <Link to="/signup">
          회원가입
        </Link>
      </nav>

      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />
      </Routes>
    </>
  );
}

export default App;