'use client';

import { useState } from 'react';
import SimpleCEPPicker from './SimpleCEPPicker';

interface DeliveryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function DeliveryForm({ onSubmit, onCancel }: DeliveryFormProps) {
  const [formData, setFormData] = useState({
    pickup_address: '',
    delivery_address: '',
    pickup_lat: '',
    pickup_lng: '',
    delivery_lat: '',
    delivery_lng: '',
    price: '',
    description: ''
  });
  const [showMap, setShowMap] = useState(false);
  const [mapType, setMapType] = useState<'pickup' | 'delivery'>('pickup');

  const openGoogleMap = (type: 'pickup' | 'delivery') => {
    setMapType(type);
    setShowMap(true);
  };

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      [`${mapType}_address`]: address,
      [`${mapType}_lat`]: lat.toString(),
      [`${mapType}_lng`]: lng.toString()
    }));
    setShowMap(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calcular rota usando Google Directions
    let route = null;
    if (formData.pickup_lat && formData.pickup_lng && formData.delivery_lat && formData.delivery_lng) {
      try {
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${formData.pickup_lat},${formData.pickup_lng}&destination=${formData.delivery_lat},${formData.delivery_lng}&key=YOUR_API_KEY`;
        // Como não temos API key, vamos usar uma rota simulada
        route = {
          distance: calculateDistance(
            parseFloat(formData.pickup_lat), parseFloat(formData.pickup_lng),
            parseFloat(formData.delivery_lat), parseFloat(formData.delivery_lng)
          ),
          duration: 'Estimado',
          polyline: `${formData.pickup_lat},${formData.pickup_lng}|${formData.delivery_lat},${formData.delivery_lng}`
        };
      } catch (error) {
        console.error('Erro ao calcular rota:', error);
      }
    }
    
    onSubmit({
      pickup_address: formData.pickup_address,
      delivery_address: formData.delivery_address,
      pickup_lat: parseFloat(formData.pickup_lat),
      pickup_lng: parseFloat(formData.pickup_lng),
      delivery_lat: parseFloat(formData.delivery_lat),
      delivery_lng: parseFloat(formData.delivery_lng),
      price: parseFloat(formData.price),
      description: formData.description,
      route: route
    });
  };

  // Função para calcular distância aproximada
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(2)} km`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 w-full max-w-md shadow-xl border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Criar Nova Entrega</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-800">Local de Coleta</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Endereço de coleta"
                value={formData.pickup_address}
                onChange={(e) => setFormData({...formData, pickup_address: e.target.value})}
                className="flex-1 p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => openGoogleMap('pickup')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                🗺️ Selecionar no Mapa
              </button>
            </div>
            {formData.pickup_lat && formData.pickup_lng && (
              <div className="text-xs text-blue-600">
                Coordenadas: {formData.pickup_lat}, {formData.pickup_lng}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-800">Local de Entrega</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Endereço de entrega"
                value={formData.delivery_address}
                onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                className="flex-1 p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => openGoogleMap('delivery')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                🗺️ Selecionar no Mapa
              </button>
            </div>
            {formData.delivery_lat && formData.delivery_lng && (
              <div className="text-xs text-blue-600">
                Coordenadas: {formData.delivery_lat}, {formData.delivery_lng}
              </div>
            )}
          </div>
          
          {formData.pickup_lat && formData.pickup_lng && formData.delivery_lat && formData.delivery_lng && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-800 mb-2">🗺️ Rota Calculada</p>
              <p className="text-xs text-blue-600">
                Distância: {calculateDistance(
                  parseFloat(formData.pickup_lat), parseFloat(formData.pickup_lng),
                  parseFloat(formData.delivery_lat), parseFloat(formData.delivery_lng)
                )}
              </p>
              <a
                href={`https://www.google.com/maps/dir/${formData.pickup_lat},${formData.pickup_lng}/${formData.delivery_lat},${formData.delivery_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                🔗 Ver rota no Google Maps
              </a>
            </div>
          )}
          <input
            type="number"
            step="0.01"
            placeholder="Valor da entrega"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Descrição da entrega"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-blue-300 rounded-md h-20 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
            >
              Chamar Motoboy
            </button>
          </div>
        </form>

        <SimpleCEPPicker
          isOpen={showMap}
          title={`Selecionar ${mapType === 'pickup' ? 'Local de Coleta' : 'Local de Entrega'}`}
          onSelect={handleMapSelect}
          onClose={() => setShowMap(false)}
        />
      </div>
    </div>
  );
}