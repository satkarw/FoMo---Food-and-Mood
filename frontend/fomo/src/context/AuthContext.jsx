"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authFetch } from "@/app/lib/authFetch";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    // console.log("trying to fetch")
    try {
      const data = await authFetch("accounts/me/");
      setUser(data);
      // console.log(data)
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    await authFetch("accounts/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await fetchUser();
  };

  const login = async (data) => {
    await authFetch("accounts/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await fetchUser();
  };

  const logout = async () => {
    await authFetch("accounts/logout/", { method: "POST" });
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
