import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APPLE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerStep1 = async (data: { email: string; password: string; confirm_password: string }) => {
  return api.post("/accounts/auth/signup/", data);
};

export const verifyEmail = async (data: { code: string }) => {
  console.log("Yuborilayotgan so‘rov:", data);
  return api.post("/accounts/auth/email-verify/", data);
};

export const signIn = async ( data: { email: string; password: string; }) => {
  return api.post("/accounts/auth/signin/", data);
};

export const getProfile = async (token: string) => {
  console.log("GET so‘rov headeri:", { Authorization: `Bearer ${token}` });
  return api.get("/accounts/account/profile/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const forgotPassword = async (data: { email: string }) => {
  console.log("Forgot password so‘rovi:", data);
  return api.post("/accounts/auth/forgot-password/", data);
};

export const resetPassword = async (token: string, data: { new_password: string; confirm_password: string }) => {
  console.log("Reset password so‘rovi:", { token, data });
  return api.post(`/accounts/auth/reset-password/${token}/`, data);
};


