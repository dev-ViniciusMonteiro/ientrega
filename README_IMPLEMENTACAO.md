# 🚀 PlayDelivery - Frontend Implementado

Sistema completo de gestão de entregas implementado com Next.js 15, TypeScript e Tailwind CSS.

## 📁 Estrutura Implementada

```
src/
├── app/
│   ├── api/                    # API Routes (proxy para backend)
│   │   ├── auth/login/         # Autenticação
│   │   ├── deliveries/         # CRUD de entregas
│   │   ├── users/              # Gestão de usuários
│   │   └── wallet/[userId]/    # Carteira do usuário
│   ├── dashboard/              # Painéis por role
│   │   ├── loja/               # Dashboard da loja
│   │   ├── motoboy/            # Dashboard do motoboy
│   │   └── admin/              # Dashboard administrativo
│   ├── login/                  # Página de login
│   └── page.tsx                # Redirecionamento automático
├── components/                 # Componentes reutilizáveis
│   ├── Layout.tsx              # Layout principal
│   ├── ProtectedRoute.tsx      # Proteção de rotas
│   ├── DeliveryForm.tsx        # Formulário de entregas
│   └── DeliveryTable.tsx       # Tabela de entregas
└── utils/                      # Utilitários
    ├── auth.ts                 # Funções de autenticação
    └── api.ts                  # Cliente API
```

## 🔐 Sistema de Autenticação

- Login com email/senha
- Armazenamento de token no localStorage
- Redirecionamento automático baseado no role:
  - `store` → `/dashboard/loja`
  - `courier` → `/dashboard/motoboy`
  - `admin` → `/dashboard/admin`
- Proteção de rotas por role

## 🏪 Painel da Loja

**Funcionalidades:**
- ✅ Criar novas entregas
- ✅ Visualizar todas as entregas da loja
- ✅ Acompanhar status das entregas
- ✅ Ver entregas concluídas e valores

**Abas:**
- **Entregas**: Lista todas as entregas com status
- **Pagamentos**: Mostra entregas concluídas e valores

## 🏍️ Painel do Motoboy

**Funcionalidades:**
- ✅ Ver entregas disponíveis para aceitar
- ✅ Aceitar entregas pendentes
- ✅ Atualizar status das entregas (coletada → finalizada)
- ✅ Visualizar saldo da carteira
- ✅ Gerenciar suas entregas ativas

**Abas:**
- **Entregas Disponíveis**: Entregas pendentes para aceitar
- **Minhas Entregas**: Entregas aceitas pelo motoboy

## 👨‍💼 Painel Administrativo

**Funcionalidades:**
- ✅ Dashboard com estatísticas gerais
- ✅ Visualizar todas as entregas do sistema
- ✅ Gerenciar usuários (lojas, motoboys, admins)
- ✅ Métricas de receita e performance

**Cards de Estatísticas:**
- Total de entregas
- Entregas concluídas
- Receita total
- Usuários ativos

## 🛠️ Componentes Implementados

### Layout.tsx
- Header com nome do usuário e role
- Botão de logout
- Layout responsivo

### ProtectedRoute.tsx
- Verificação de autenticação
- Controle de acesso por role
- Redirecionamento automático

### DeliveryForm.tsx
- Modal para criar entregas
- Validação de campos
- Integração com API

### DeliveryTable.tsx
- Tabela responsiva de entregas
- Ações específicas por role
- Formatação de dados (preço, data, status)

## 🔌 API Routes

Todas as rotas fazem proxy para o backend:

- `POST /api/auth/login` - Login
- `GET /api/deliveries` - Listar entregas
- `POST /api/deliveries` - Criar entrega
- `PUT /api/deliveries/[id]` - Atualizar entrega
- `GET /api/users` - Listar usuários
- `GET /api/wallet/[userId]` - Consultar carteira

## 🎨 Estilização

- **Tailwind CSS** para estilização
- Design responsivo
- Componentes com estados visuais
- Cores e badges para status
- Layout moderno e limpo

## 🚀 Como Executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
# .env.local
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

4. **Acessar:**
- Frontend: http://localhost:3000
- Redirecionamento automático para /login

## 📱 Fluxo de Uso

### Loja:
1. Login → Dashboard da Loja
2. Criar entrega → Preencher formulário
3. Acompanhar entregas na tabela
4. Ver pagamentos na aba correspondente

### Motoboy:
1. Login → Dashboard do Motoboy
2. Ver entregas disponíveis
3. Aceitar entrega → Mover para "Minhas Entregas"
4. Atualizar status: Aceita → Coletada → Finalizada
5. Saldo atualizado automaticamente

### Admin:
1. Login → Dashboard Administrativo
2. Ver estatísticas gerais
3. Gerenciar todas as entregas
4. Visualizar usuários do sistema

## 🔧 Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Hooks** - Gerenciamento de estado
- **Fetch API** - Comunicação com backend

## 📝 Próximos Passos

- [ ] Implementar notificações em tempo real
- [ ] Adicionar mapas para rastreamento
- [ ] Sistema de avaliações
- [ ] Relatórios avançados
- [ ] PWA para mobile