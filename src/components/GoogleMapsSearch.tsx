'use client';

import { useState } from 'react';

interface GoogleMapsSearchProps {
  isOpen: boolean;
  title: string;
  onSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export default function GoogleMapsSearch({ isOpen, title, onSelect, onClose }: GoogleMapsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSrc, setMapSrc] = useState('https://maps.google.com/maps?q=São+Paulo,+SP&t=&z=13&ie=UTF8&iwloc=&output=embed');
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        // NÃO definir selectedCoords aqui - apenas mover o mapa
        setMapSrc(`https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const handleMapClick = () => {
    const instruction = 'INSTRUÇÕES:\n1. Clique no local exato no mapa\n2. Clique com botão direito no ponto\n3. Clique nas coordenadas que aparecem\n4. Cole aqui as coordenadas copiadas';
    const coords = prompt(`${instruction}\n\nCole as coordenadas (formato: -23.550520, -46.633308):`);
    if (coords) {
      const cleanCoords = coords.replace(/[^0-9.,-]/g, '').trim();
      const [lat, lng] = cleanCoords.split(',').map(c => parseFloat(c.trim()));
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        console.log('Coordenadas selecionadas:', lat, lng); // Debug
        setSelectedCoords({ lat, lng });
        setSearchQuery(`Local selecionado: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        setMapSrc(`https://maps.google.com/maps?q=${lat},${lng}&t=&z=17&ie=UTF8&iwloc=&output=embed`);
      } else {
        alert('Coordenadas inválidas. Use o formato: -23.550520, -46.633308');
      }
    }
  };

  const handleConfirm = () => {
    if (selectedCoords) {
      const address = searchQuery || `${selectedCoords.lat.toFixed(6)}, ${selectedCoords.lng.toFixed(6)}`;
      onSelect(selectedCoords.lat, selectedCoords.lng, address);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Digite o endereço para buscar (ex: Av. Paulista, São Paulo)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              🔍 Buscar
            </button>
          </div>

          <div className="relative">
            <iframe
              src={mapSrc}
              className="w-full h-96 border rounded-lg"
              loading="lazy"
            />
            <button
              onClick={handleMapClick}
              className="absolute top-2 right-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
            >
              📍 Marcar Local
            </button>
          </div>

          {selectedCoords && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">✓ Localização selecionada!</p>
              <p className="text-sm text-green-600">
                Coordenadas: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              1. Busque a região 2. Clique "📍 Marcar Local" 3. Clique no ponto exato do mapa 4. Botão direito > copie coordenadas
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
                disabled={!selectedCoords}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                ✓ Confirmar Localização
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}