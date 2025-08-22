'use client';

import { useState } from 'react';

interface StoreModalProps {
  user: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function StoreModal({ user, onSubmit, onCancel }: StoreModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      user_id: user.id,
      name: formData.name,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 w-full max-w-md shadow-xl border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Ativar Loja: {user.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da loja"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Endereço completo"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Latitude (ex: -23.5505)"
            value={formData.latitude}
            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
            className="w-full p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude (ex: -46.6333)"
            value={formData.longitude}
            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
            className="w-full p-3 border border-blue-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Ativar Loja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}