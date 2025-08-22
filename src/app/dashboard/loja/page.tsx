'use client';

import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import DeliveryForm from '../../../components/DeliveryForm';
import DeliveryTable from '../../../components/DeliveryTable';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function PainelLoja() {
  const [deliveries, setDeliveries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('entregas');
  const [wallet, setWallet] = useState({ balance: 0 });

  useEffect(() => {
    fetchDeliveries();
    fetchWallet();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
    }
  };

  const handleCreateDelivery = async (deliveryData: any) => {
    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(deliveryData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        setShowForm(false);
        fetchDeliveries();
        alert('Entrega criada com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar entrega');
      }
    } catch (error) {
      alert('Erro ao criar entrega');
    }
  };

  const fetchWallet = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`/api/wallet/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      setWallet(data);
    } catch (error) {
      console.error('Erro ao buscar carteira:', error);
    }
  };

  const completedDeliveries = deliveries.filter((d: any) => d.status === 'completed');

  return (
    <ProtectedRoute allowedRoles={['store']}>
      <Layout title="Painel da Loja">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard da Loja</h1>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Saldo: R$ {Number(wallet.balance || 0).toFixed(2)}
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Criar Entrega
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('entregas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'entregas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Entregas
              </button>
              <button
                onClick={() => setActiveTab('pagamentos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pagamentos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pagamentos
              </button>
            </nav>
          </div>

          {activeTab === 'entregas' && (
            <DeliveryTable 
              deliveries={deliveries} 
              userRole="store"
              onRefresh={fetchDeliveries}
            />
          )}

          {activeTab === 'pagamentos' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Entregas Concluídas</h3>
                {completedDeliveries.length > 0 ? (
                  <div className="space-y-3">
                    {completedDeliveries.map((delivery: any) => (
                      <div key={delivery.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">
                          #{delivery.id} - {delivery.customer_name}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          R$ {delivery.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma entrega concluída ainda.</p>
                )}
              </div>
            </div>
          )}

          {showForm && (
            <DeliveryForm 
              onSubmit={handleCreateDelivery}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}