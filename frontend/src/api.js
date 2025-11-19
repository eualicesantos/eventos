const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export async function apiGet(path) {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.detail || `Erro ao fazer GET em ${path} (status ${res.status})`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Erro em apiGet:", error);
    throw error;
  }
}

export async function apiPost(path, body) {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {}),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.detail || data.message || `Erro ao fazer POST em ${path} (status ${res.status})`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Erro em apiPost:", error);
    throw error;
  }
}

// === AUTENTICAÇÃO ===

export function loginUsuario(email, senha) {
  return apiPost("/usuarios/login/", {
    email,
    password: senha,
  });
}

export function cadastrarUsuario(nome, email, senha) {
  // O backend ignora "nome" por enquanto, mas mantemos para futuro uso
  return apiPost("/usuarios/registrar/", {
    username: email, // usamos o próprio e-mail como username
    email,
    password: senha,
    tipo: "cliente",
  });
}

export function cadastrarAdm(nome, email, senha) {
  return apiPost("/usuarios/registrar/", {
    username: email,
    email,
    password: senha,
    tipo: "organizador",
  });
}

// === EVENTOS / INGRESSOS ===
// Os métodos abaixo seguem a API existente em backend/app/urls.py e eventos_app/urls.py

export function listarEventos() {
  return apiGet("/eventos/");
}

export function buscarEventoPorId(id) {
  return apiGet(`/eventos/${id}/`);
}

// Nesta versão do front, a compra e o pagamento ainda são simulados em tela.
// Mas deixamos funções preparadas para integração real.
export function comprarIngresso(eventoId, quantidade, compradorNome) {
  console.warn("comprarIngresso ainda está em modo simulado no frontend.");
  return Promise.resolve({
    sucesso: true,
    eventoId,
    quantidade,
    comprador_nome: compradorNome,
  });
}

export function pagarComCartao(dadosCartao) {
  console.warn("pagarComCartao ainda está em modo simulado no frontend.");
  return Promise.resolve({ pago: true, ...dadosCartao });
}

export function gerarPagamentoPix(eventoId, valorTotal) {
  console.warn("gerarPagamentoPix ainda está em modo simulado no frontend.");
  return Promise.resolve({
    qr_code: "https://api.qrserver.com/v1/create-qr-code/?data=PagamentoPIX-Simulado&size=200x200",
    eventoId,
    valorTotal,
  });
}

export function confirmarCompra(dados) {
  console.warn("confirmarCompra ainda está em modo simulado no frontend.");
  return Promise.resolve({
    confirmado: true,
    ...dados,
  });
}

// Export default estilo objeto para facilitar importações antigas
const api = {
  apiGet,
  apiPost,
  loginUsuario,
  cadastrarUsuario,
  cadastrarAdm,
  listarEventos,
  buscarEventoPorId,
  comprarIngresso,
  pagarComCartao,
  gerarPagamentoPix,
  confirmarCompra,
};

export default api;
