import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constant/api";

interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  error: string | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  token: null,
  error: null,

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    console.log(username, email, password);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        set({ user: data.user, token: data.token, isLoading: false });

        return { success: true };
      } else {
        const errorMessage = data.message || "Registration failed";
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Registration error";
      set({ isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const UserJson = await AsyncStorage.getItem("user");
      const user = UserJson ? JSON.parse(UserJson) : null;
      set({ token, user });
    } catch (error) {
      console.log("Auth check failed", error);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data));
        await AsyncStorage.setItem("token", JSON.stringify(data.token));
        set({ user: data.user, token: data.token, isLoading: false });
        return { success: true };
      } else {
        const errorMsg = data.message || "Login failed";
        set({ error: errorMsg, isLoading: false });
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Login failed";
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout Failed";
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
