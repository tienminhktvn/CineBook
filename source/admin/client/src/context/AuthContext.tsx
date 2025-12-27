import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, LoginRequest } from "../types";
import { authService } from "../services";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          // Verify cookie session is still valid
          const response = await authService.getMe();
          setUser(response.data);
          // Update stored user in case it changed
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch {
          // Cookie expired or invalid, clear user data
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    const { user } = response.data;

    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      // This will clear the httpOnly cookie on backend
      await authService.logout();
    } catch {
      // Ignore errors, clear local state anyway
    }
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
