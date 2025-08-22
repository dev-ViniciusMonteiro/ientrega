'use client';

interface Delivery {
  id: number;
  customer_name: string;
  delivery_address: string;
  price: number;
  status: string;
  created_at: string;
  courier_id?: number;
  distance?: string;
}

interface DeliveryTableProps {
  deliveries: Delivery[];
  userRole: string;
  onRefresh: () => void;
  onAcceptDelivery?: (id: number) => void;
  onUpdateStatus?: (id: number, status: string) => void;
  showAcceptButton?: boolean;
}

const statusLabels: { [key: string]: string } = {
  available: 'Disponível',
  accepted: 'Aceita',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada'
};

const statusColors: { [key: string]: string } = {
  available: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function DeliveryTable({ 
  deliveries, 
  userRole, 
  onRefresh, 
  onAcceptDelivery, 
  onUpdateStatus,
  showAcceptButton = false
}: DeliveryTableProps) {
  
  const handleDeliveryAction = async (deliveryId: number, action: 'accept' | 'start' | 'complete') => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/${action}`, {
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
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || `Erro ao ${action === 'accept' ? 'aceitar' : action === 'start' ? 'iniciar' : 'finalizar'} entrega`);
      }
    } catch (error) {
      alert('Erro na operação');
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Entregas</h3>
          <button
            onClick={onRefresh}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Atualizar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distância
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{delivery.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.customer_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {delivery.delivery_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.distance || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(delivery.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[delivery.status]}`}>
                      {statusLabels[delivery.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(delivery.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {userRole === 'courier' && delivery.status === 'available' && (
                      <button
                        onClick={() => handleDeliveryAction(delivery.id, 'accept')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                      >
                        Aceitar
                      </button>
                    )}
                    {userRole === 'courier' && delivery.status === 'accepted' && (
                      <button
                        onClick={() => handleDeliveryAction(delivery.id, 'start')}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
                      >
                        Iniciar
                      </button>
                    )}
                    {userRole === 'courier' && delivery.status === 'in_progress' && (
                      <button
                        onClick={() => handleDeliveryAction(delivery.id, 'complete')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                      >
                        Finalizar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {deliveries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma entrega encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}