import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    const response = await api.post(
      "/usuarios/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    localStorage.setItem("token", response.data.access_token);

    alert("Login realizado com sucesso!");
    navigate("/dashboard");

  } catch (error) {
    alert("Credenciais invalidas");
  }
};

    return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
    
        <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}