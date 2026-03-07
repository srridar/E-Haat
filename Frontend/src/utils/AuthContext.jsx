import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // ✅ Login function
  const login = (newToken) => {
    localStorage.setItem("userToken", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};