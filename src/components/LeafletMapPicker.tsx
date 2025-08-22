'use client';

import { useState } from 'react';

interface LeafletMapPickerProps {
  isOpen: boolean;
  title: string;
  onSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export default function LeafletMapPicker({ isOpen, title, onSelect, onClose }: LeafletMapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const address = data[0].display_name;
        setSelectedLocation({ lat, lng, address });
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      // Já tem localização da busca, só confirmar
      return;
    }
    // Se não tem localização, pedir para buscar primeiro
    alert('Digite um endereço ou CEP na busca primeiro');
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation.lat, selectedLocation.lng, selectedLocation.address);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Digite endereço, CEP ou local (ex: Av. Paulista, São Paulo)"
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
              src={selectedLocation 
                ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lng-0.01},${selectedLocation.lat-0.01},${selectedLocation.lng+0.01},${selectedLocation.lat+0.01}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}`
                : "https://www.openstreetmap.org/export/embed.html?bbox=-46.7,-23.6,-46.5,-23.4&layer=mapnik"
              }
              className="w-full h-80 border rounded-lg"
            />
            {selectedLocation && (
              <div className="absolute top-2 right-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium">
                ✓ Local Encontrado
              </div>
            )}
          </div>

          {selectedLocation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">✓ Localização selecionada!</p>
              <p className="text-sm text-green-600">
                Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
              <p className="text-sm text-green-600">Endereço: {selectedLocation.address}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Digite seu CEP ou endereço, veja no mapa e confirme a localização
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
                disabled={!selectedLocation}
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