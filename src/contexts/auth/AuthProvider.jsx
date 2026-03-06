import { useState, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";

const USER_STORAGE_KEY = "auth_user";

const loadUser = () => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);
  const [pendingCode, setPendingCode] = useState(null);

  const sendCode = useCallback(async (phone) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setPendingCode(code);
    console.log(`[Mock OTP] Code for ${phone}: ${code}`);
    return { success: true, expiresIn: 300 };
  }, []);

  const login = useCallback(async (phone, code) => {
    if (code !== pendingCode) {
      return { success: false, error: "Невірний код" };
    }
    const userData = { id: 1, phone, name: "" };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setPendingCode(null);
    return { success: true };
  }, [pendingCode]);

  const loginWithGoogle = useCallback(async () => {
    const userData = {
      id: 2,
      name: "Google User",
      email: "user@gmail.com",
      avatar: null,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
    return { success: true };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      sendCode,
      login,
      loginWithGoogle,
      logout,
      updateUser,
    }),
    [user, sendCode, login, loginWithGoogle, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
