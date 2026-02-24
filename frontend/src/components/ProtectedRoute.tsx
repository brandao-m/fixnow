import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

//Verifica se existe token no localStorage
//Se NÃO existir → redireciona para login
//Se existir → permite acessar a rota