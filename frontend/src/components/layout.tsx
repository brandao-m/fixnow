import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  user: {
    nome: string;
    role: string;
  } | null;
}

export default function Layout({ children, user }: LayoutProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
  <div className="min-h-screen w-full bg-gray-950 text-gray-100 flex flex-col">
    
    <header className="w-full bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-blue-500">
        FixNow
      </h1>

      {user && (
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">{user.nome}</span>
            <span className="ml-2 text-blue-400 uppercase">
              {user.role}
            </span>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>

    <main className="flex-1 w-full flex justify-center">
      <div className="w-full max-w-6xl px-8 py-10">
        {children}
      </div>
    </main>

  </div>
);
}
