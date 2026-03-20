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
  tecnico_sugerido?: {
    id: number,
    nome: string;
  };
}

type UserRole = 'cliente' | 'tecnico' | 'central';

interface User {
  id: number;
  nome: string;
  role: UserRole;
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
  const [analiseIA, setAnaliseIA] = useState<any>(null);

  async function carregarChamados() {
    const response = await api.get("/chamados/");
    setChamados(response.data);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const userResponse = await api.get("/usuarios/me");

        const usuarioLogado = userResponse.data as User;
        setUser(usuarioLogado);

        await carregarChamados();

        if (usuarioLogado.role === "central") {
          const responseTecnicos = await api.get("/usuarios/tecnicos");
          setTecnicos(responseTecnicos.data);
        }
      } catch {
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
        tecnico_sugerido_id: analiseIA?.tecnico?.id || null
      });

      setTitulo("");
      setDescricao("");
      setEndereco("");
      setAnaliseIA(null);
      setMostrarFormulario(false);

      await carregarChamados();
    } catch {
      setErro("Erro ao criar chamado");
    }
  }

  async function atribuirTecnico(chamadoId: number, tecnicoId: number) {
    try {
      await api.put(`/chamados/${chamadoId}/atribuir/${tecnicoId}`);
      await carregarChamados();
    } catch {
      setErro("Erro ao atribuir técnico");
    }
  }

  async function analisarComIA() {
  try {
    const response = await api.post("/chamados/ai/analisar", {
      descricao,
    });

    const resultado = response.data.resultado;
    const tecnico = response.data.tecnico_sugerido;

    setAnaliseIA({
      ...resultado,
      tecnico
    });

    if (!titulo) {
      setTitulo(resultado.descricao_melhorada);
    }

  } catch (error) {
    console.error("Erro ao analisar com IA", error);
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

  const total = chamados.length;
  const abertos = chamados.filter(c => c.status === "ABERTO").length;
  const andamento = chamados.filter(c => c.status === "EM_ANDAMENTO").length;
  const concluidos = chamados.filter(c => c.status === "CONCLUIDO").length;

  function isCentral(user: User | null): boolean {
    return user?.role === 'central';
  }

  return (
    <Layout user={user}>
      <div className="p-6 max-w-7xl mx-auto">

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: total },
            { label: "Abertos", value: abertos },
            { label: "Em andamento", value: andamento },
            { label: "Concluídos", value: concluidos },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{item.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-400">
            Dashboard
          </h2>

          {user?.role === "cliente" && (
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              + Novo Chamado
            </button>
          )}
        </div>

          {erro && (
            <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4">
              {erro}
            </div>
          )}

        {/* FORMULÁRIO */}
        {user?.role === "cliente" && mostrarFormulario && (
          <div className="bg-gray-900 p-6 rounded-2xl mb-10 border border-gray-800 max-w-2xl">

            <div className="flex flex-col gap-5">

              <input
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="bg-gray-800 p-2 text-white rounded"
              />

              <textarea
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="bg-gray-800 p-2 text-white rounded"
              />

              <input
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="bg-gray-800 p-2 text-white rounded"
              />

              {/* IA */}
              <button
                type="button"
                onClick={analisarComIA}
                disabled={!descricao}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded"
              >
                🤖 Analisar com IA
              </button>

              {analiseIA && (
                <div className="bg-purple-900/40 border border-purple-700 p-4 rounded">

                  <p className="text-purple-300 text-sm mb-2">
                    Sugestão da IA
                  </p>

                  <p className="text-white text-sm">
                    🛠 {analiseIA.categoria}
                  </p>

                  <p className={`text-sm ${
                    analiseIA.urgencia === "alta"
                      ? "text-red-400"
                      : analiseIA.urgencia === "média"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}>
                    ⚡ {analiseIA.urgencia}
                  </p>

                  {isCentral(user) && analiseIA.tecnico && (
                    <p className="text-white text-sm">
                      👨‍🔧 Técnico sugerido: {analiseIA.tecnico.nome}
                    </p>
                  )}

                </div>
              )}

              <button
                onClick={criarChamado}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Criar chamado
              </button>

            </div>
          </div>
        )}

        {/* LISTA */}
        <div className="grid gap-4">
          {chamados.map((chamado) => (
            <div
              key={chamado.id}
              onClick={() => navigate(`/chamados/${chamado.id}`)}
              className="bg-gray-900 p-6 rounded-2xl cursor-pointer"
            >
              <h3 className="text-white">{chamado.titulo}</h3>
              <p className="text-gray-400">{chamado.descricao}</p>
              {isCentral(user) && chamado.tecnico_sugerido && (
                <p className="text-purple-400 text-sm mt-2">
                  🤖 Sugestão IA: {chamado.tecnico_sugerido.nome}
                </p>
              )}
              
              <div
                  className="flex items-center gap-3 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* BOTÃO IA */}
                  {isCentral(user) && chamado.tecnico_sugerido && chamado.status === "ABERTO" && (
                    <button
                      onClick={() =>
                        atribuirTecnico(chamado.id, chamado.tecnico_sugerido!.id)
                      }
                      className="bg-purple-600 hover:bg-purple-700 transition px-3 py-1 rounded text-sm"
                    >
                      Aceitar sugestão
                    </button>
                  )}

                  {/* SELECT MANUAL */}
                  {isCentral(user) && chamado.status === "ABERTO" && (
                    <select
                      onChange={(e) =>
                        atribuirTecnico(chamado.id, Number(e.target.value))
                      }
                      defaultValue=""
                      className="bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded text-sm"
                    >
                      <option value="" disabled>
                        Escolher técnico
                      </option>

                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </select>
                  )}

                </div>

              {renderStatusBadge(chamado.status)}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}