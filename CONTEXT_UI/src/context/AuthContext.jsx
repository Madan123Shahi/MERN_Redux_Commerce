import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getToken, setToken, clearToken } from "../services/tokenService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     LOGIN
  ---------------------------------- */
  const login = (data) => {
    setToken(data.accessToken);
    setUser(data.user);
  };

  /* ----------------------------------
     LOGOUT
  ---------------------------------- */
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // backend clears refresh cookie
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearToken();
      setUser(null);
    }
  };

  /* ----------------------------------
     SILENT REFRESH ON APP LOAD
  ---------------------------------- */
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        // If access token exists, assume user is logged in
        if (getToken()) {
          setLoading(false);
          return;
        }

        // Try refreshing access token via cookie
        const res = await api.get("/auth/refresh");
        setToken(res.data.accessToken);

        // OPTIONAL (recommended): fetch user profile
        const profile = await api.get("/auth/me");
        setUser(profile.data.user);
      } catch (err) {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
