import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/layout";

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  endereco: string;
  status: string;
  tecnico_id?: number | null;
}

interface User {
  id: number;
  nome: string;
  role: string;
}

export default function DetalheChamado() {
  const { id } = useParams();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [tecnicoAtribuido, setTecnicoAtribuido] = useState<User | null>(null);

  async function finalizarChamado() {
    try {
      await api.put(`/chamados/${chamado?.id}/finalizar`);
      await carregarChamado();
    } catch (error) {
      alert('Erro ao finalizar chamado')
    }
  }

  async function atribuirTecnico(tecnicoId: number) {
    try {
      await api.put(`/chamados/${chamado?.id}/atribuir/${tecnicoId}`);
      await carregarChamado();
    } catch (error) {
      alert('Erro ao atribuir técnico');
    } 
  }

  async function carregarChamado() {
    const response = await api.get(`/chamados/`);
    const encontrado = response.data.find(
      (c: Chamado) => c.id === Number(id)
    );

    setChamado(encontrado);

    if (encontrado?.tecnico_id) {
      const responseTecnicos = await api.get('/usuarios/tecnicos');
      const tecnico = responseTecnicos.data.find(
        (t: User) => t.id === encontrado.tecnico_id
      );
      setTecnicoAtribuido(tecnico || null);
    }
  }

  useEffect(() => {
    async function carregarDados() {
      const userResponse = await api.get("/usuarios/me");
      const usuarioLogado = userResponse.data;
      setUser(usuarioLogado);

      await carregarChamado();

      if (usuarioLogado.role === 'central') {
        const responseTecnicos = await api.get('/usuarios/tecnicos');
        setTecnicos(responseTecnicos.data);
      }
    }

    carregarDados();
  }, []);

  if (!chamado) {
    return (
      <Layout user={user}>
        <p className="text-gray-400">Carregando...</p>
      </Layout>
    );
  }

  function renderStatusColor(status: string) {
  switch (status) {
    case "ABERTO":
      return "text-red-400";
    case "EM_ANDAMENTO":
      return "text-yellow-400";
    case "CONCLUIDO":
      return "text-green-400";
    default:
      return "text-blue-400";
  }
}

  return (
    <Layout user={user}> 
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        Detalhes do Chamado
      </h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">

          {/* TÍTULO */}
          <div>
            <h3 className="text-2xl font-bold text-white">
              {chamado.titulo}
            </h3>
          </div>

          {/* STATUS + TÉCNICO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-800 pt-4">

            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className={`${renderStatusColor(chamado.status)} font-semibold text-lg`}>
                {chamado.status}
              </p>
            </div>

            {tecnicoAtribuido && (
              <div>
                <p className="text-gray-400 text-sm">Técnico responsável</p>
                <p className="text-white font-semibold text-lg">
                  {tecnicoAtribuido.nome}
                </p>
              </div>
            )}

          </div>

          {/* DESCRIÇÃO */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm mb-1">Descrição</p>
            <p className="text-white leading-relaxed">
              {chamado.descricao}
            </p>
          </div>

          {/* ENDEREÇO */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm mb-1">Endereço</p>
            <p className="text-white">
              {chamado.endereco}
            </p>
          </div>

</div>

        {user?.role === 'central' && chamado.status === 'ABERTO' && (
          <div className="mt-4">
            <select
              onChange={(e) => atribuirTecnico(Number(e.target.value))}
              defaultValue=''
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md"
            >
              <option value='' disabled>
                Selecionar Técnico
              </option>

              {tecnicos.map((tecnico) => (
                <option key={tecnico.id} value={tecnico.id}>
                  {tecnico.nome}
                </option>
              ))}
             </select>
             </div>
        )}

        {user?.role === 'tecnico' && chamado.status === 'EM_ANDAMENTO' && (
          <button 
            onClick={finalizarChamado}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            Finalizar Chamado
          </button>
        )}
        </div>
    </Layout>
  );
}