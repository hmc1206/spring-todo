import apiClient from "./client";

export interface SignupRequest {
    loginId: string;
    password : string;
    nickname : string;
}

export interface LoginRequest {
    loginId: string;
    password: string;
}

export const signup = async (
  data: SignupRequest,
): Promise<number> => {
  const response = await apiClient.post<number>(
    "/api/users/signup",
    data,
  );

  return response.data;
};

export const login = async (
  data: LoginRequest,
): Promise<string> => {
  const response = await apiClient.post<string>(
    "/api/users/login",
    data,
  );

  return response.data;
};