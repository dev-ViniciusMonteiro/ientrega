'use client';

import { useState } from 'react';

interface SimpleCEPPickerProps {
  isOpen: boolean;
  title: string;
  onSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export default function SimpleCEPPicker({ isOpen, title, onSelect, onClose }: SimpleCEPPickerProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number, address: string} | null>(null);

  const handleCEPSearch = async () => {
    if (cep.length !== 8) return;
    
    setLoading(true);
    try {
      // Buscar endereço pelo CEP
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const cepData = await cepResponse.json();
      
      if (cepData.erro) {
        alert('CEP não encontrado');
        setLoading(false);
        return;
      }

      const fullAddress = `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}`;
      
      // Buscar coordenadas
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
      const geoData = await geoResponse.json();
      
      if (geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lng = parseFloat(geoData[0].lon);
        setLocation({ lat, lng, address: fullAddress });
      } else {
        alert('Não foi possível encontrar as coordenadas');
      }
    } catch (error) {
      alert('Erro ao buscar CEP');
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    if (location) {
      onSelect(location.lat, location.lng, location.address);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-800 pr-2">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                placeholder="Digite o CEP (ex: 01310100)"
                value={cep}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCep(value);
                  if (value.length === 8) {
                    handleCEPSearch();
                  }
                }}
                maxLength={8}
                className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <button
                onClick={handleCEPSearch}
                disabled={cep.length !== 8 || loading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? '⏳ Buscando...' : '🔍 Buscar CEP'}
              </button>
            </div>
          </div>

          {location && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium text-sm sm:text-base">✓ Localização encontrada!</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1 break-words">
                  <strong>Endereço:</strong> {location.address}
                </p>
                <p className="text-xs sm:text-sm text-green-600">
                  <strong>Coordenadas:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.005},${location.lat-0.005},${location.lng+0.005},${location.lat+0.005}&layer=mapnik&marker=${location.lat},${location.lng}`}
                  className="w-full h-48 sm:h-64"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!location}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              ✓ Confirmar Localização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}