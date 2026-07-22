import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";

interface SignupFormData {
  loginId: string;
  password: string;
  nickname: string;
}

const SignupForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    loginId: "",
    password: "",
    nickname: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    console.log(
      "회원가입 요청 데이터:",
      formData,
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        {/* 제목 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            회원가입
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Spring Todo를 시작해보세요.
          </p>
        </div>

        {/* 회원가입 폼 */}
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

          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              닉네임
            </label>

            <input
              id="nickname"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            회원가입
          </button>
        </form>

        {/* 로그인 이동 */}
        <div className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;