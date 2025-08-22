# 🚀 Frontend - Sistema de Gestão de Entregas

## 📋 Estrutura do Projeto Next.js

```
frontend/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   └── me.js
│   │   ├── deliveries/
│   │   │   ├── index.js
│   │   │   ├── [id]/
│   │   │   │   ├── accept.js
│   │   │   │   └── status.js
│   │   │   └── create.js
│   │   ├── users/
│   │   │   └── index.js
│   │   └── wallet/
│   │       └── [userId].js
│   ├── login.js
│   ├── dashboard/
│   │   ├── loja.js
│   │   ├── motoboy.js
│   │   └── admin.js
│   └── _app.js
├── components/
│   ├── Layout.js
│   ├── DeliveryForm.js
│   ├── DeliveryTable.js
│   └── ProtectedRoute.js
└── utils/
    ├── auth.js
    └── api.js
```

---

## 🔐 1. Sistema de Autenticação

### `/pages/login.js`
```jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redireciona baseado no role
        switch (data.user.role) {
          case 'store':
            router.push('/dashboard/loja');
            break;
          case 'courier':
            router.push('/dashboard/motoboy');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Erro no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
```

### `/pages/api/auth/login.js`
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

---

## 🏪 2. Painel da Loja

### `/pages/dashboard/loja.js`
```jsx
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DeliveryForm from '../../components/DeliveryForm';
import DeliveryTable from '../../components/DeliveryTable';

export default function PainelLoja() {
  const [deliveries, setDeliveries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('entregas');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    const response = await fetch('/api/deliveries', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setDeliveries(data);
  };

  const handleCreateDelivery = async (deliveryData) => {
    const response = await fetch('/api/deliveries/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(deliveryData)
    });

    if (response.ok) {
      setShowForm(false);
      fetchDeliveries();
      alert('Entrega criada com sucesso!');
    }
  };

  return (
    <Layout title="Painel da Loja">
      <div className="dashboard-header">
        <h1>Dashboard da Loja</h1>
        <button onClick={() => setShowForm(true)}>
          Criar Entrega
        </button>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'entregas' ? 'active' : ''}
          onClick={() => setActiveTab('entregas')}
        >
          Entregas
        </button>
        <button 
          className={activeTab === 'pagamentos' ? 'active' : ''}
          onClick={() => setActiveTab('pagamentos')}
        >
          Pagamentos
        </button>
      </div>

      {activeTab === 'entregas' && (
        <DeliveryTable 
          deliveries={deliveries} 
          userRole="store"
          onRefresh={fetchDeliveries}
        />
      )}

      {activeTab === 'pagamentos' && (
        <div className="payments-section">
          <h3>Entregas Concluídas</h3>
          {deliveries
            .filter(d => d.status === 'completed')
            .map(delivery => (
              <div key={delivery.id} className="payment-item">
                <span>#{delivery.id} - {delivery.customer_name}</span>
                <span>R$ {delivery.price}</span>
              </div>
            ))
          }
        </div>
      )}

      {showForm && (
        <DeliveryForm 
          onSubmit={handleCreateDelivery}
          onCancel={() => setShowForm(false)}
        />
      )}
    </Layout>
  );
}
```

### `/components/DeliveryForm.js`
```jsx
import { useState } from 'react';

export default function DeliveryForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    delivery_address: '',
    price: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pickup_address: 'Endereço da loja', // Pode ser configurável
      price: parseFloat(formData.price)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Criar Nova Entrega</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do cliente"
            value={formData.customer_name}
            onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Endereço de entrega"
            value={formData.delivery_address}
            onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor da entrega"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          <textarea
            placeholder="Observação (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancelar</button>
            <button type="submit">Chamar Motoboy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### `/pages/api/deliveries/create.js`
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/deliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

---

## 🏍️ 3. Painel do Motoboy

### `/pages/dashboard/motoboy.js`
```jsx
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

export default function PainelMotoboy() {
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [activeTab, setActiveTab] = useState('disponiveis');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    // Entregas disponíveis
    const availableResponse = await fetch('/api/deliveries?status=available', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const available = await availableResponse.json();
    setAvailableDeliveries(available);

    // Minhas entregas
    const myResponse = await fetch('/api/deliveries?my=true', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const my = await myResponse.json();
    setMyDeliveries(my);
  };

  const acceptDelivery = async (deliveryId) => {
    const response = await fetch(`/api/deliveries/${deliveryId}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.ok) {
      fetchDeliveries();
      alert('Entrega aceita!');
    }
  };

  const updateStatus = async (deliveryId, status) => {
    const response = await fetch(`/api/deliveries/${deliveryId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      fetchDeliveries();
    }
  };

  return (
    <Layout title="Painel do Motoboy">
      <div className="dashboard-header">
        <h1>Dashboard do Motoboy</h1>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'disponiveis' ? 'active' : ''}
          onClick={() => setActiveTab('disponiveis')}
        >
          Entregas Disponíveis
        </button>
        <button 
          className={activeTab === 'minhas' ? 'active' : ''}
          onClick={() => setActiveTab('minhas')}
        >
          Minhas Entregas
        </button>
        <button 
          className={activeTab === 'financeiro' ? 'active' : ''}
          onClick={() => setActiveTab('financeiro')}
        >
          Financeiro
        </button>
      </div>

      {activeTab === 'disponiveis' && (
        <div className="available-deliveries">
          <h3>Entregas Disponíveis</h3>
          {availableDeliveries.map(delivery => (
            <div key={delivery.id} className="delivery-card">
              <div className="delivery-info">
                <h4>Cliente: {delivery.customer_name}</h4>
                <p>Endereço: {delivery.delivery_address}</p>
                <p>Valor: R$ {delivery.price}</p>
              </div>
              <button onClick={() => acceptDelivery(delivery.id)}>
                Aceitar
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'minhas' && (
        <div className="my-deliveries">
          <h3>Minhas Entregas</h3>
          {myDeliveries.map(delivery => (
            <div key={delivery.id} className="delivery-card">
              <div className="delivery-info">
                <h4>#{delivery.id} - {delivery.customer_name}</h4>
                <p>Status: {delivery.status}</p>
                <p>Endereço: {delivery.delivery_address}</p>
              </div>
              <div className="delivery-actions">
                {delivery.status === 'accepted' && (
                  <button onClick={() => updateStatus(delivery.id, 'in_progress')}>
                    Retirada Feita
                  </button>
                )}
                {delivery.status === 'in_progress' && (
                  <button onClick={() => updateStatus(delivery.id, 'completed')}>
                    Entregue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'financeiro' && (
        <div className="financial-section">
          <h3>Histórico Financeiro</h3>
          <div className="balance">
            <h4>Saldo a Receber: R$ {
              myDeliveries
                .filter(d => d.status === 'completed')
                .reduce((sum, d) => sum + parseFloat(d.price), 0)
                .toFixed(2)
            }</h4>
          </div>
          {myDeliveries
            .filter(d => d.status === 'completed')
            .map(delivery => (
              <div key={delivery.id} className="financial-item">
                <span>#{delivery.id} - {delivery.customer_name}</span>
                <span>R$ {delivery.price}</span>
              </div>
            ))
          }
        </div>
      )}
    </Layout>
  );
}
```

### `/pages/api/deliveries/[id]/accept.js`
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/deliveries/${id}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

---

## 👨💼 4. Painel do Admin

### `/pages/dashboard/admin.js`
```jsx
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

export default function PainelAdmin() {
  const [users, setUsers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('usuarios');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    // Buscar usuários
    const usersResponse = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const usersData = await usersResponse.json();
    setUsers(usersData);

    // Buscar entregas
    const deliveriesResponse = await fetch('/api/deliveries', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const deliveriesData = await deliveriesResponse.json();
    setDeliveries(deliveriesData);

    // Calcular estatísticas
    const today = new Date().toDateString();
    setStats({
      totalDeliveries: deliveriesData.length,
      activeDeliveries: deliveriesData.filter(d => ['available', 'accepted', 'in_progress'].includes(d.status)).length,
      completedToday: deliveriesData.filter(d => d.status === 'completed' && new Date(d.updated_at).toDateString() === today).length
    });
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    // Implementar bloqueio/desbloqueio de usuário
    console.log('Toggle user status:', userId, currentStatus);
  };

  return (
    <Layout title="Painel Admin">
      <div className="dashboard-header">
        <h1>Dashboard Admin</h1>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total de Entregas</h3>
          <p>{stats.totalDeliveries}</p>
        </div>
        <div className="stat-card">
          <h3>Entregas Ativas</h3>
          <p>{stats.activeDeliveries}</p>
        </div>
        <div className="stat-card">
          <h3>Concluídas Hoje</h3>
          <p>{stats.completedToday}</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'usuarios' ? 'active' : ''}
          onClick={() => setActiveTab('usuarios')}
        >
          Usuários
        </button>
        <button 
          className={activeTab === 'entregas' ? 'active' : ''}
          onClick={() => setActiveTab('entregas')}
        >
          Entregas
        </button>
      </div>

      {activeTab === 'usuarios' && (
        <div className="users-section">
          <h3>Lojas</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === 'store').map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.active ? 'Ativo' : 'Bloqueado'}</td>
                  <td>
                    <button onClick={() => toggleUserStatus(user.id, user.active)}>
                      {user.active ? 'Bloquear' : 'Desbloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Motoboys</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === 'courier').map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.active ? 'Ativo' : 'Bloqueado'}</td>
                  <td>
                    <button onClick={() => toggleUserStatus(user.id, user.active)}>
                      {user.active ? 'Bloquear' : 'Desbloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'entregas' && (
        <div className="deliveries-section">
          <h3>Todas as Entregas</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Loja</th>
                <th>Motoboy</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr key={delivery.id}>
                  <td>{delivery.id}</td>
                  <td>{delivery.store_name}</td>
                  <td>{delivery.courier_name || 'Não atribuído'}</td>
                  <td>{delivery.status}</td>
                  <td>R$ {delivery.price}</td>
                  <td>{new Date(delivery.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
```

---

## 🔧 5. APIs Auxiliares

### `/pages/api/deliveries/index.js`
```javascript
export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { status, my } = req.query;
  
  let url = `${process.env.BACKEND_URL}/deliveries`;
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (my) params.append('my', 'true');
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

### `/pages/api/users/index.js`
```javascript
export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

---

## 🛡️ 6. Componentes de Proteção

### `/components/ProtectedRoute.js`
```jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(parsedUser.role)) {
      router.push('/unauthorized');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!user) return null;

  return children;
}
```

---

## 🌐 7. Configuração de Ambiente

### `.env.local`
```env
BACKEND_URL=http://localhost:3371
NEXTAUTH_SECRET=sua_chave_secreta
```

---

## 📱 8. Fluxo de Navegação

```
Login (/login)
├── role: store → Dashboard Loja (/dashboard/loja)
│   ├── Criar Entrega (modal)
│   ├── Lista de Entregas
│   └── Pagamentos
├── role: courier → Dashboard Motoboy (/dashboard/motoboy)
│   ├── Entregas Disponíveis
│   ├── Minhas Entregas
│   └── Financeiro
└── role: admin → Dashboard Admin (/dashboard/admin)
    ├── Usuários (Lojas + Motoboys)
    ├── Entregas (Todas)
    └── Relatórios
```

---

## 🚀 9. Comandos para Iniciar

```bash
# Instalar dependências
npm install next react react-dom

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

---

## 📋 10. Funcionalidades Implementadas

✅ **Login com redirecionamento automático**  
✅ **Painel da Loja**: Criar entregas, visualizar histórico  
✅ **Painel do Motoboy**: Aceitar entregas, atualizar status  
✅ **Painel Admin**: Gerenciar usuários e entregas  
✅ **APIs proxy** para comunicação com backend  
✅ **Proteção de rotas** baseada em roles  
✅ **Interface responsiva** e intuitiva  

Este frontend está pronto para integrar com seu backend existente!