import { useEffect, useMemo, useState } from "react";

import {
  getProfile,
  getStoredToken,
  loginUser,
  removeStoredToken,
  setStoredToken,
  signupUser,
} from "../services/api";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        setUser(response.user);
      } catch {
        removeStoredToken();
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const signup = async (payload) => {
    const response = await signupUser(payload);
    setStoredToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    setStoredToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  const refreshProfile = async () => {
    const response = await getProfile();
    setUser(response.user);
    return response.user;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      refreshProfile,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
