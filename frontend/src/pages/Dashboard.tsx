import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/layout";

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  endereco: string;
  status: string;
}

interface User {
  id: number;
  nome: string;
  role: string;
}

export default function Dashboard() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");

  async function carregarChamados() {
    const response = await api.get("/chamados/");
    setChamados(response.data);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const userResponse = await api.get("/usuarios/me");
        setUser(userResponse.data);
        await carregarChamados();
      } catch (error) {
        alert("Erro ao carregar dados");
      }
    }

    carregarDados();
  }, []);

  async function criarChamado() {
    try {
      await api.post("/chamados/", {
        titulo,
        descricao,
        endereco,
      });

      setTitulo("");
      setDescricao("");
      setEndereco("");
      setMostrarFormulario(false);

      await carregarChamados();
    } catch (error) {
      alert("Erro ao criar chamado");
    }
  }

  return (
    <Layout user={user}>
      {/* Header do Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-400">
          Dashboard
        </h2>

        {user?.role === "cliente" && (
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Novo Chamado
          </button>
        )}
      </div>

      {/* Formulário */}
      {user?.role === "cliente" && mostrarFormulario && (
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">
            Criar Novo Chamado
          </h3>

          <div className="flex flex-col gap-3">
            <input
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <input
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <button
              onClick={criarChamado}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold transition"
            >
              Criar Chamado
            </button>
          </div>
        </div>
      )}

      {/* Lista de chamados */}
      <h3 className="text-2xl font-semibold mb-4">
        Chamados
      </h3>

      {chamados.length === 0 ? (
        <p className="text-gray-500">Nenhum chamado encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {chamados.map((chamado) => (
            <div
              key={chamado.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-blue-400">
                {chamado.titulo}
              </h3>

              <p className="text-gray-400 mt-2">
                {chamado.descricao}
              </p>

              <p className="mt-3 text-sm">
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-green-400">
                  {chamado.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}