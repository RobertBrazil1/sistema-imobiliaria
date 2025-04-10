'use client';

import React, { useState, useEffect } from 'react';
import { Imovel } from '../types/imovel';

export default function Home() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/imoveis')
      .then(response => response.json())
      .then(data => setImoveis(data));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Imóveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveis.map(imovel => (
          <div key={imovel.id} className="bg-white rounded-lg shadow-md p-6">
            <img 
              src={imovel.fotos[0]} 
              alt={imovel.titulo} 
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-xl font-semibold mt-4">{imovel.titulo}</h2>
            <p className="text-gray-600 mt-2">{imovel.descricao}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              R$ {imovel.valor.toLocaleString('pt-BR')}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {imovel.tipo}
              </span>
              {imovel.aceitaFinanciamento && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Aceita Financiamento
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 