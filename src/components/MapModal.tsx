'use client';

import { useState } from 'react';

interface MapModalProps {
  isOpen: boolean;
  title: string;
  onSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export default function MapModal({ isOpen, title, onSelect, onClose }: MapModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSrc, setMapSrc] = useState('https://maps.google.com/maps?q=São+Paulo,+SP&t=&z=13&ie=UTF8&iwloc=&output=embed');

  if (!isOpen) return null;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery);
      setMapSrc(`https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
    }
  };

  const handleConfirm = () => {
    const address = searchQuery || 'Localização selecionada';
    // Usar coordenadas padrão de São Paulo se não especificado
    onSelect(-23.5505, -46.6333, address);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[600px] relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Digite o endereço, cidade ou local (ex: Av. Paulista, São Paulo)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            🔍 Buscar
          </button>
        </div>

        <iframe
          src={mapSrc}
          className="w-full h-96 border rounded-lg"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Pesquise o local desejado e clique em "Confirmar Localização"
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              ✓ Confirmar Localização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}