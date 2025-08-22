'use client';

import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import DeliveryTable from '../../../components/DeliveryTable';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StoreModal from '../../../components/StoreModal';
import CourierModal from '../../../components/CourierModal';
import CreditModal from '../../../components/CreditModal';

export default function PainelAdmin() {
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('entregas');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    totalRevenue: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchDeliveries();
    fetchUsers();
    fetchStats();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries?all=true', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [deliveriesRes, usersRes] = await Promise.all([
        fetch('/api/deliveries?all=true', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const deliveriesData = await deliveriesRes.json();
      const usersData = await usersRes.json();

      const completedDeliveries = deliveriesData.filter((d: any) => d.status === 'completed');
      const totalRevenue = completedDeliveries.reduce((sum: number, d: any) => sum + d.price, 0);

      setStats({
        totalDeliveries: deliveriesData.length,
        completedDeliveries: completedDeliveries.length,
        totalRevenue,
        activeUsers: usersData.length
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleActivateStore = async (storeData: any) => {
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(storeData)
      });

      if (response.ok) {
        alert('Loja ativada com sucesso!');
        setShowStoreModal(false);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao ativar loja');
      }
    } catch (error) {
      alert('Erro ao ativar loja');
    }
  };

  const handleActivateCourier = async (courierData: any) => {
    try {
      const response = await fetch('/api/couriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courierData)
      });

      if (response.ok) {
        alert('Motoboy ativado com sucesso!');
        setShowCourierModal(false);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao ativar motoboy');
      }
    } catch (error) {
      alert('Erro ao ativar motoboy');
    }
  };

  const handleAddCredit = async (creditData: any) => {
    try {
      const response = await fetch(`/api/wallet/${selectedUser?.id}/add-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(creditData)
      });

      if (response.ok) {
        alert('Crédito adicionado com sucesso!');
        setShowCreditModal(false);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao adicionar crédito');
      }
    } catch (error) {
      alert('Erro ao adicionar crédito');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout title="Painel Administrativo">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">E</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Entregas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalDeliveries}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Entregas Concluídas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completedDeliveries}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">R$</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Receita Total
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        R$ {stats.totalRevenue.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Usuários Ativos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.activeUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
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
                Todas as Entregas
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'usuarios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuários
              </button>
            </nav>
          </div>

          {activeTab === 'entregas' && (
            <DeliveryTable 
              deliveries={deliveries} 
              userRole="admin"
              onRefresh={fetchDeliveries}
            />
          )}

          {activeTab === 'usuarios' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usuários do Sistema</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user: any) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.role === 'store' ? 'Loja' : user.role === 'courier' ? 'Motoboy' : 'Admin'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Ativo
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {user.role === 'store' && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowStoreModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Ativar Loja
                              </button>
                            )}
                            {user.role === 'courier' && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowCourierModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Ativar Motoboy
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowCreditModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Adicionar Crédito
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {showStoreModal && selectedUser && (
          <StoreModal
            user={selectedUser}
            onSubmit={handleActivateStore}
            onCancel={() => {
              setShowStoreModal(false);
              setSelectedUser(null);
            }}
          />
        )}

        {showCourierModal && selectedUser && (
          <CourierModal
            user={selectedUser}
            onSubmit={handleActivateCourier}
            onCancel={() => {
              setShowCourierModal(false);
              setSelectedUser(null);
            }}
          />
        )}

        {showCreditModal && selectedUser && (
          <CreditModal
            user={selectedUser}
            onSubmit={handleAddCredit}
            onCancel={() => {
              setShowCreditModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
}