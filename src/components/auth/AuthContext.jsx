import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useAuth } from "react-oidc-context";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const prevIsAuthenticated = useRef(false); // Para rastrear el estado previo

  const authValue = useMemo(() => {
    if (auth.isLoading || !auth.user) {
      return { isLoading: auth.isLoading, isAuthenticated: false, isAdmin: false };
    }

    const decodedToken = jwtDecode(auth.user.id_token);
    const isAdmin = decodedToken["cognito:groups"]?.includes("admin");

    return {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      isAdmin,
    };
  }, [auth]);

  // Vaciar localStorage solo cuando el usuario deja de estar autenticado
  useEffect(() => {
    if (prevIsAuthenticated.current && !authValue.isAuthenticated) {
      localStorage.clear(); // Limpia el almacenamiento local solo si cambia de autenticado a no autenticado
    }
    prevIsAuthenticated.current = authValue.isAuthenticated; // Actualiza el estado previo
  }, [authValue.isAuthenticated]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
