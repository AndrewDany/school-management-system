import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("sms_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await client.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        await AsyncStorage.removeItem("sms_token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email, password) {
    const res = await client.post("/auth/login", { email, password });
    await AsyncStorage.setItem("sms_token", res.data.token);
    // Fetch the full profile (with studentProfile / classesTaught) right after login
    const meRes = await client.get("/auth/me");
    setUser(meRes.data);
    return meRes.data;
  }

  async function logout() {
    await AsyncStorage.removeItem("sms_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
