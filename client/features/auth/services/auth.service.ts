import api from "@/lib/axios";
import { User } from "@/types/User";
import { z } from "zod";
import {
  loginSchema,
  registerSchema,
} from "@/features/auth/schemas/authSchema";
import * as SecureStore from "expo-secure-store";
import { APIResponse } from "@/types/common";

const TOKEN_KEY = "token";

// Input Types inferred from Zod
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterInput, "confirmPassword">;

interface AuthResult extends User {
  token?: string;
}

const authService = {
  // 1. Register
  register: async (data: RegisterRequest): Promise<AuthResult> => {
    const response = await api.post<APIResponse<AuthResult>>(
      "/auth/register",
      data
    );
    return response.data.data;
  },

  // 2. Login
  login: async (data: LoginInput): Promise<AuthResult> => {
    const response = await api.post<APIResponse<AuthResult>>(
      "/auth/login",
      data
    );
    return response.data.data;
  },

  // 3. Get Current User (Me)
  getMe: async (): Promise<User> => {
    const response = await api.get<APIResponse<User>>("/auth/me");
    // The server returns { success: true, data: User } or just User depending on controller.
    // Based on standard established: { success: true, data: User }
    return response.data.data;
  },

  // 4. Logout (Client-side mainly)
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  // Helper: Persist Token
  setToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  getToken: async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
};

export default authService;
