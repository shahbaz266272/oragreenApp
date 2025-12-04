import axios from "axios";
import { API_URL } from "./productService";

const xApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4";

const client = axios.create({
  baseURL: `${API_URL}/api/v1/app/user`,
  headers: {
    "x-api-key": xApiKey,
    "Content-Type": "application/json",
  },
});

const authService = {
  loginWithEmail: async (email, password) =>
    client.post("/login", { email, password }),
  signUp: async (payload) => client.post("/register", payload),
  sendForgotPasswordOtp: async (email) =>
    client.post("/forgot-password", { email }),
  resetPassword: async ({ email, otp, password }) =>
    client.post("/reset-password", { email, otp, password }),
};

export default authService;
