import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function NovoChamado() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
    
        try{
            await api.post('/chamados/', {
                titulo,
                descricao,
            });

            navigate('/dashboard');
        } catch (error) {
            alert('Erro ao criar chamado');
        }
    }

    return (
        <div className='max-w-2xl mx-auto'>
            <h1 className='text-2xl font-bold text-blue-500 mb-6'>
                Novo Chamado
            </h1>

            <form onSubmit={handleSubmit} className='space-y-5'>

                <div>
                    <label className='block text-sm text-gray-300 mb-2'>
                        Titulo
                    </label>
                    <input
                    type='text'
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    />
                </div>
                <div>
          <label className="block text-sm text-gray-300 mb-2">
            Descrição
          </label>
          <textarea
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Criar Chamado
        </button>

      </form>
    </div>
  );
}