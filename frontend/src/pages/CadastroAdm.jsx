import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import { cadastrarAdm } from "../api";

export default function CadastroAdm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await cadastrarAdm(nome, email, senha);
      alert("Administrador cadastrado com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      setErro(error.message || "Falha ao cadastrar administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Administrador</h2>

      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

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
          {loading ? "Cadastrando..." : "Cadastrar ADM"}
        </button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <Link to="/login" className="voltar-link">
        Voltar ao Login
      </Link>
    </div>
  );
}
