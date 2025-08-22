'use client';

import { useState } from 'react';

interface CourierModalProps {
  user: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CourierModal({ user, onSubmit, onCancel }: CourierModalProps) {
  const [formData, setFormData] = useState({
    vehicle_type: 'motorcycle',
    license_plate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      user_id: user.id,
      vehicle_type: formData.vehicle_type,
      license_plate: formData.license_plate
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Ativar Motoboy: {user.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.vehicle_type}
            onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="motorcycle">Moto</option>
            <option value="bicycle">Bicicleta</option>
            <option value="car">Carro</option>
          </select>
          <input
            type="text"
            placeholder="Placa do veículo (ex: ABC-1234)"
            value={formData.license_plate}
            onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Ativar Motoboy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}