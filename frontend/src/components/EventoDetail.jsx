import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost } from '../api';

export default function EventoDetail() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [quantidade, setQuantidade] = useState(1);
  const [comprador, setComprador] = useState('');
  const [comprando, setComprando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const dadosTeste = {
    1: {
      id: 1,
      nome: 'Show de Rock',
      descricao: 'Um show incrível de rock!',
      data: '2025-11-15',
      horario: '20:00',
      local: 'Arena Central',
      ingressos_disponiveis: 100,
      imagem: 'https://via.placeholder.com/600x320?text=Show+de+Rock'
    },
    2: {
      id: 2,
      nome: 'Festival de Música',
      descricao: 'Festival com várias bandas',
      data: '2025-12-01',
      horario: '18:00',
      local: 'Parque das Flores',
      ingressos_disponiveis: 500,
      imagem: 'https://via.placeholder.com/600x320?text=Festival'
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Tenta buscar da API, se falhar usa dados de teste
    apiGet(`/eventos/${id}/`)
      .then(data => {
        if (mounted) {
          setEvento(data);
          setLoading(false);
        }
      })
      .catch(e => {
        if (mounted) {
          console.warn('Usando dados de teste:', e.message);
          const eventoMockado = dadosTeste[id];
          if (eventoMockado) {
            setEvento(eventoMockado);
          } else {
            setErro('Evento não encontrado');
          }
          setLoading(false);
        }
      });
    
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div>Carregando evento...</div>;
  if (erro) return <div className="error">Erro: {erro}</div>;
  if (!evento) return <div>Evento não encontrado.</div>;

  const handleComprar = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (quantidade < 1) { setMensagem('Quantidade mínima é 1'); return; }
    if (quantidade > evento.ingressos_disponiveis) { 
      setMensagem('Quantidade maior que ingressos disponíveis'); 
      return; 
    }

    setComprando(true);
    try {
      const body = {
        evento: evento.id,
        quantidade: Number(quantidade),
        comprador_nome: comprador || null
      };
      const resp = await apiPost('/ingressos/', body);
      setMensagem(`Ingresso(s) comprado(s)! ID: ${resp.id || '—'}`);
      setEvento(prev => ({ 
        ...prev, 
        ingressos_disponiveis: prev.ingressos_disponiveis - quantidade 
      }));
    } catch (err) {
      setMensagem(`Erro ao comprar: ${err.message}`);
    } finally {
      setComprando(false);
    }
  };

  return (
    <div className="evento-detail">
      <Link to="/" className="back">← Voltar</Link>
      <h2>{evento.nome}</h2>
      <div className="detail-grid">
        <img 
          src={evento.imagem || 'https://via.placeholder.com/600x320?text=Sem+imagem'} 
          alt={evento.nome} 
          className="detail-img"
        />
        <div className="detail-info">
          <p className="meta">{evento.data} • {evento.horario} — {evento.local}</p>
          <p>{evento.descricao}</p>
          <p><strong>Ingressos disponíveis:</strong> {evento.ingressos_disponiveis}</p>

          <form onSubmit={handleComprar} className="purchase-form">
            <h3>Comprar ingresso</h3>
            <label>
              Quantidade
              <input 
                type="number" 
                min="1" 
                max={evento.ingressos_disponiveis} 
                value={quantidade} 
                onChange={e => setQuantidade(Number(e.target.value))} 
              />
            </label>
            <label>
              Nome do comprador (opcional)
              <input 
                type="text" 
                value={comprador} 
                onChange={e => setComprador(e.target.value)} 
                placeholder="Nome para o ingresso" 
              />
            </label>
            <button 
              type="submit" 
              className="btn" 
              disabled={comprando || evento.ingressos_disponiveis === 0}
            >
              {comprando ? 'Processando...' : 'Comprar'}
            </button>
            {mensagem && <p className="message">{mensagem}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
