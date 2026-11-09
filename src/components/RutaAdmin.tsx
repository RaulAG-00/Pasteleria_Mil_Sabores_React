import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Si alguien entra a /admin sin ser administrador, lo mandamos al login.
export default function RutaAdmin({ children }: { children: ReactNode }) {
  const { esAdministrador } = useAuth();
  return esAdministrador ? <>{children}</> : <Navigate to="/login" replace />;
}