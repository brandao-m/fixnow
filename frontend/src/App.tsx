import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovoChamado from "./pages/NovoChamado";
import ProtectedRoute from "./components/ProtectedRoute";
import DetalheChamado from "./pages/DetalheChamado";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD PROTEGIDO */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* DETALHES DOS CHAMADOS */}
        <Route
          path='/chamados/:id'
          element={
            <ProtectedRoute>
              <DetalheChamado />
            </ProtectedRoute>
          }
        />

        {/* NOVO CHAMADO PROTEGIDO */}
        <Route
          path="/novo-chamado"
          element={
            <ProtectedRoute>
              <NovoChamado />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
export default App;