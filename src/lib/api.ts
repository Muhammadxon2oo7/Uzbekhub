// import axios, { AxiosInstance } from "axios";

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_APPLE,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const registerStep1 = async (data: { email: string; password: string; confirm_password: string }) => {
//   return api.post("/accounts/auth/signup/", data);
// };

// export const verifyEmail = async (data: { code: string }) => {
//   console.log("Yuborilayotgan so‘rov:", data);
//   return api.post("/accounts/auth/email-verify/", data);
// };

// export const signIn = async ( data: { email: string; password: string; }) => {
//   return api.post("/accounts/auth/signin/", data);
// };

// export const getProfile = async (token: string) => {
//   console.log("GET so‘rov headeri:", { Authorization: `Bearer ${token}` });
//   return api.get("/accounts/account/profile/", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const forgotPassword = async (data: { email: string }) => {
//   console.log("Forgot password so‘rovi:", data);
//   return api.post("/accounts/auth/forgot-password/", data);
// };

// export const resetPassword = async (token: string, data: { new_password: string; confirm_password: string }) => {
//   console.log("Reset password so‘rovi:", { token, data });
//   return api.post(`/accounts/auth/reset-password/${token}/`, data);
// };




import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APPLE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export const registerStep1 = async (data: { email: string; password: string; confirm_password: string }) => {
  return api.post("/accounts/auth/signup/", data);
};

export const verifyEmail = async (data: { code: string }) => {
  console.log("Yuborilayotgan so‘rov:", data);
  return api.post("/accounts/auth/email-verify/", data);
};

export const signIn = async (data: { email: string; password: string }) => {
  return api.post("/accounts/auth/signin/", data);
};

export const getProfile = async (token: string) => {
  console.log("GET so‘rov headeri:", { Authorization: `Bearer ${token}` });
  return api.get("/accounts/account/profile/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfile = async (token: string, data: FormData) => {
  console.log("PATCH so‘rov headeri:", { Authorization: `Bearer ${token}` });
  return api.patch("/accounts/account/profile/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const checkUsername = async (username: string) => {
  console.log("Check username so‘rovi:", username);
  const token = localStorage.getItem("token");

  return api.get(
    `/accounts/account/check/username/?username=${username}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const changeEmail = async (token: string, data: { new_email: string; password: string }) => {
  console.log("Change email so‘rovi:", { token, data });
  return api.post("/accounts/account/change-email/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const confirmEmailChange = async (token: string, data: { code: string }) => {
  console.log("Confirm email change so‘rovi:", { token, data });
  return api.post("/accounts/account/change-email/confirm/", data, {
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
// api.ts
export const getAllUsers = async (token: any) => {
  return api.get("/accounts/admin/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
export const getUserById = async (id: string | number, token: string) => {
  return api.get(`/accounts/admin/user/${id}`, {
    headers:  {
      Authorization: `Bearer ${token}`
    }
  });
};
