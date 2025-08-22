'use client';

import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import DeliveryTable from '../../../components/DeliveryTable';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function PainelMotoboy() {
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [activeTab, setActiveTab] = useState('disponiveis');
  const [wallet, setWallet] = useState({ balance: 0 });

  useEffect(() => {
    fetchAvailableDeliveries();
    fetchMyDeliveries();
    fetchWallet();
  }, []);

  const fetchAvailableDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries?status=available', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      setAvailableDeliveries(data);
    } catch (error) {
      console.error('Erro ao buscar entregas disponíveis:', error);
    }
  };

  const fetchMyDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries/my/deliveries', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      setMyDeliveries(data);
    } catch (error) {
      console.error('Erro ao buscar minhas entregas:', error);
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

  const handleAcceptDelivery = async (deliveryId: number) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        fetchAvailableDeliveries();
        fetchMyDeliveries();
        alert('Entrega aceita com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao aceitar entrega');
      }
    } catch (error) {
      alert('Erro ao aceitar entrega');
    }
  };

  const handleUpdateStatus = async (deliveryId: number, action: string) => {
    try {
      const endpoint = action === 'in_progress' ? 'start' : 'complete';
      const response = await fetch(`/api/deliveries/${deliveryId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        fetchMyDeliveries();
        if (action === 'completed') {
          fetchWallet();
        }
        alert(`Entrega ${action === 'in_progress' ? 'iniciada' : 'finalizada'} com sucesso!`);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['courier']}>
      <Layout title="Painel do Motoboy">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard do Motoboy</h1>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Saldo: R$ {Number(wallet.balance || 0).toFixed(2)}
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('disponiveis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'disponiveis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Entregas Disponíveis ({availableDeliveries.length})
              </button>
              <button
                onClick={() => setActiveTab('minhas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'minhas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Minhas Entregas ({myDeliveries.length})
              </button>
            </nav>
          </div>

          {activeTab === 'disponiveis' && (
            <DeliveryTable 
              deliveries={availableDeliveries} 
              userRole="courier"
              onRefresh={fetchAvailableDeliveries}
              onAcceptDelivery={handleAcceptDelivery}
              showAcceptButton={true}
            />
          )}

          {activeTab === 'minhas' && (
            <DeliveryTable 
              deliveries={myDeliveries} 
              userRole="courier"
              onRefresh={fetchMyDeliveries}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}