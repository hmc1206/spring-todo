import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { login } from "../../api/userApi";

interface LoginFormData {
  loginId: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    loginId: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      //로그인 api 호출
      const token = await login(formData);

      console.log("login success")
      console.log("JWT : ", token);

      localStorage.setItem(
        "accessToken",
        token,
      );
      alert("login succeed!");

      //todo 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그인 실패 : ", error);
    }

    console.log("로그인 요청 데이터:", formData);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        {/* 제목 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Spring Todo
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            오늘의 할 일을 관리해보세요.
          </p>
        </div>

        {/* 로그인 폼 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* 아이디 */}
          <div>
            <label
              htmlFor="loginId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              아이디
            </label>

            <input
              id="loginId"
              name="loginId"
              type="text"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            로그인
          </button>
        </form>

        {/* 회원가입 */}
        <div className="mt-6 text-center text-sm text-slate-500">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;