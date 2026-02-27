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
  tecnico_id?: number;
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

  return (
    <Layout user={user}> 
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        Detalhes do Chamado
      </h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div>
            <button
                onClick={() => navigate("/dashboard")}
                className="mb-6 text-blue-400 font-bold hover:text-blue-300 transition"
            >
                ← Voltar
           </button>
          <p className="text-gray-400 text-sm">Título</p>
          <p className="text-white text-lg">{chamado.titulo}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Descrição</p>
          <p className="text-white">{chamado.descricao}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Endereço</p>
          <p className="text-white">{chamado.endereco}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-blue-400 font-semibold">
            {chamado.status}
          </p>
        </div>

        {user?.role === 'central' && chamado.status === 'ABERTO' && (
          <div className="mt-4">
            <p className="text-red-400">
              Role: {user?.role} | Status: {chamado.status}
            </p>


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