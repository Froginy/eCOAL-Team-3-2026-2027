import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const api_url = import.meta.env.VITE_API_URL;
        const response = await fetch(`${api_url}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (response.status === 401) {
          logout();
          return;
        }
        if (!response.ok) throw new Error("Profile fetch failed");
        const data = await response.json();
        setUser(data.data || null);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser(userData || { token: newToken });
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
