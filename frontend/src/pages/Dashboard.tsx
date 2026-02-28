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
  const navigate = useNavigate();

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");

  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarChamados() {
    const response = await api.get("/chamados/");
    setChamados(response.data);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const userResponse = await api.get("/usuarios/me");
        const usuarioLogado = userResponse.data;
        setUser(usuarioLogado);

        await carregarChamados();

        if (usuarioLogado.role === "central") {
          const responseTecnicos = await api.get("/usuarios/tecnicos");
          setTecnicos(responseTecnicos.data);
        }
      } catch (error) {
        setErro("Erro ao carregar dados");
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
      setErro("Erro ao criar chamado");
    }
  }

  async function atribuirTecnico(chamadoId: number, tecnicoId: number) {
    try {
      await api.put(`/chamados/${chamadoId}/atribuir/${tecnicoId}`);
      await carregarChamados();
    } catch (error) {
      setErro("Erro ao atribuir técnico");
    }
  }

  async function finalizarChamado(id: number) {
    try {
      await api.put(`/chamados/${id}/finalizar`);
      await carregarChamados();
    } catch (error) {
      setErro("Erro ao finalizar chamado");
    }
  }

  function renderStatusBadge(status: string) {
    switch (status) {
      case "ABERTO":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
            Aberto
          </span>
        );
      case "EM_ANDAMENTO":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
            Em andamento
          </span>
        );
      case "CONCLUIDO":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
            Concluído
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <Layout user={user}>
      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total</p>
          <h3 className="text-2xl font-bold text-white">
            {chamados.length}
          </h3>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Abertos</p>
          <h3 className="text-2xl font-bold text-yellow-400">
            {chamados.filter(c => c.status === "ABERTO").length}
          </h3>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Em andamento</p>
          <h3 className="text-2xl font-bold text-blue-400">
            {chamados.filter(c => c.status === "EM_ANDAMENTO").length}
          </h3>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Concluídos</p>
          <h3 className="text-2xl font-bold text-green-400">
            {chamados.filter(c => c.status === "CONCLUIDO").length}
          </h3>
        </div>
      </div>

      {/* HEADER */}
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

      {/* ERRO */}
      {erro && (
        <div className="mb-6 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-md">
          {erro}
        </div>
      )}

      {/* FORMULÁRIO */}
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

      {/* LISTA */}
      <h3 className="text-2xl font-semibold mb-4">
        Chamados
      </h3>

      {chamados.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
          <p className="text-gray-400 text-lg">
            Nenhum chamado encontrado.
          </p>

          {user?.role === "cliente" && (
            <p className="text-gray-500 text-sm mt-2">
              Clique em "+ Novo Chamado" para abrir sua primeira solicitação.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {chamados.map((chamado) => (
            <div
              key={chamado.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/chamados/${chamado.id}`)}
            >
              <h3 className="text-lg font-semibold text-blue-400">
                {chamado.titulo}
              </h3>

              <p className="text-gray-400 mt-2">
                {chamado.descricao}
              </p>

              <div className="mt-4 flex items-center gap-4">
                {renderStatusBadge(chamado.status)}

                {user?.role === "central" && chamado.status === "ABERTO" && (
                  <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      atribuirTecnico(chamado.id, Number(e.target.value))
                    }
                    defaultValue=""
                    className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md"
                  >
                    <option value="" disabled>
                      Selecionar técnico
                    </option>

                    {tecnicos.map((tecnico) => (
                      <option key={tecnico.id} value={tecnico.id}>
                        {tecnico.nome}
                      </option>
                    ))}
                  </select>
                )}

                {user?.role === "tecnico" &&
                  chamado.status === "EM_ANDAMENTO" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        finalizarChamado(chamado.id);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
                    >
                      Finalizar
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}