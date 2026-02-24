import { useEffect, useState } from "react";
import api from "../api/api";

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

      await carregarChamados();
    } catch (error) {
      alert("Erro ao criar chamado");
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Dashboard</h2>

      {user && (
        <p>
          Bem-vindo, <strong>{user.nome}</strong> | Perfil: {user.role}
        </p>
      )}

      {user?.role === "cliente" && (
        <div style={{ marginBottom: 30 }}>
          <h3>Novo Chamado</h3>

          <input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <br />

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <br />

          <input
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <br />

          <button onClick={criarChamado}>
            Criar Chamado
          </button>
        </div>
      )}

      <h3>Chamados</h3>

      {chamados.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        chamados.map((chamado) => (
          <div
            key={chamado.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 15,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{chamado.titulo}</h3>
            <p>{chamado.descricao}</p>
            <p><strong>Status:</strong> {chamado.status}</p>
          </div>
        ))
      )}
    </div>
  );
}