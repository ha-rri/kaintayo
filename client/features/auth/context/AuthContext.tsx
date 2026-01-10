import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService, {
  LoginInput,
  RegisterRequest,
} from "../services/auth.service";
import { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  // 1. Fetch User (Me) if token exists
  const {
    data: user,
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: authService.getMe,
    retry: false,
    enabled: isReady && hasToken, // Only fetch if we've checked for token and found one
  });

  // 2. Initial Token Check
  useEffect(() => {
    const checkToken = async () => {
      const token = await authService.getToken();
      if (token) {
        setHasToken(true);
      }
      setIsReady(true);
    };
    checkToken();
  }, []);

  // 3. Mutations
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      if (data.token) {
        await authService.setToken(data.token);
        setHasToken(true);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        refetch(); // Immediately custom-fetch user
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      if (data.token) {
        await authService.setToken(data.token);
        setHasToken(true);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        refetch();
      }
    },
  });

  const logout = async () => {
    await authService.logout();
    setHasToken(false);
    queryClient.setQueryData(["authUser"], null); // Clear cache
    queryClient.clear(); // Clear all queries
  };

  const value = {
    user: user || null,
    isLoading:
      !isReady ||
      isUserLoading ||
      loginMutation.isPending ||
      registerMutation.isPending,
    isAuthenticated: !!user,
    login: async (data: LoginInput) => {
      await loginMutation.mutateAsync(data);
    },
    register: async (data: RegisterRequest) => {
      await registerMutation.mutateAsync(data);
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
