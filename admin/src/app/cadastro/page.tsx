'use client';

import { useState } from 'react';
import { Imovel } from '../../types/imovel';

export default function Cadastro() {
  const [imovel, setImovel] = useState<Partial<Imovel>>({
    titulo: '',
    descricao: '',
    valor: 0,
    tipo: 'venda',
    tipoImovel: 'casa',
    estadoImovel: 'novo',
    aceitaFinanciamento: false,
    fotos: [],
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    area: 0,
    quartos: 0,
    banheiros: 0,
    vagasGaragem: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/imoveis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imovel),
      });

      if (response.ok) {
        alert('Imóvel cadastrado com sucesso!');
        window.location.href = '/';
      } else {
        alert('Erro ao cadastrar imóvel');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar imóvel');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cadastrar Imóvel</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={imovel.titulo}
              onChange={(e) => setImovel({ ...imovel, titulo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor</label>
            <input
              type="number"
              value={imovel.valor}
              onChange={(e) => setImovel({ ...imovel, valor: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={imovel.tipo}
              onChange={(e) => setImovel({ ...imovel, tipo: e.target.value as 'venda' | 'aluguel' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Imóvel</label>
            <select
              value={imovel.tipoImovel}
              onChange={(e) => setImovel({ ...imovel, tipoImovel: e.target.value as 'casa' | 'apartamento' | 'terreno' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado do Imóvel</label>
            <select
              value={imovel.estadoImovel}
              onChange={(e) => setImovel({ ...imovel, estadoImovel: e.target.value as 'novo' | 'semi-novo' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="novo">Novo</option>
              <option value="semi-novo">Semi-novo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Aceita Financiamento</label>
            <input
              type="checkbox"
              checked={imovel.aceitaFinanciamento}
              onChange={(e) => setImovel({ ...imovel, aceitaFinanciamento: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              value={imovel.endereco}
              onChange={(e) => setImovel({ ...imovel, endereco: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              value={imovel.cidade}
              onChange={(e) => setImovel({ ...imovel, cidade: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              type="text"
              value={imovel.estado}
              onChange={(e) => setImovel({ ...imovel, estado: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              value={imovel.cep}
              onChange={(e) => setImovel({ ...imovel, cep: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
            <input
              type="number"
              value={imovel.area}
              onChange={(e) => setImovel({ ...imovel, area: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quartos</label>
            <input
              type="number"
              value={imovel.quartos}
              onChange={(e) => setImovel({ ...imovel, quartos: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Banheiros</label>
            <input
              type="number"
              value={imovel.banheiros}
              onChange={(e) => setImovel({ ...imovel, banheiros: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vagas de Garagem</label>
            <input
              type="number"
              value={imovel.vagasGaragem}
              onChange={(e) => setImovel({ ...imovel, vagasGaragem: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={imovel.descricao}
            onChange={(e) => setImovel({ ...imovel, descricao: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fotos (URLs separadas por vírgula)</label>
          <input
            type="text"
            value={imovel.fotos?.join(',')}
            onChange={(e) => setImovel({ ...imovel, fotos: e.target.value.split(',') })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://exemplo.com/foto1.jpg,https://exemplo.com/foto2.jpg"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </main>
  );
} 