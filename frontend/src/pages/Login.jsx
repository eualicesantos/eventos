import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { loginUsuario } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const data = await loginUsuario(email, senha);
      // Guarda os dados básicos do usuário logado
      localStorage.setItem("usuarioLogado", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      setErro(error.message || "Falha ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <div className="cadastro-links">
        <p>
          Não tem conta?{" "}
          <Link to="/cadastro/usuario">Cadastrar Usuário</Link>
        </p>
        <p>
          É administrador?{" "}
          <Link to="/cadastro/adm">Cadastrar ADM</Link>
        </p>
      </div>
    </div>
  );
}
