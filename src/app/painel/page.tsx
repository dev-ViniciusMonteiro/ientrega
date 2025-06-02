'use client';

export default function PainelPage() {
  return (
    <main className="min-h-screen flex bg-gray-100 text-gray-700">
      {/* Menu lateral */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
          <span className="text-xl font-bold text-blue-600">PlayDelivery</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
          <a href="/painel" className="block text-blue-600 font-semibold hover:underline">
            Dashboard
          </a>
          <a href="/lojas" className="block text-gray-700 hover:text-blue-600 hover:underline">
            Lojas
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 hover:underline">
            Entregas
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 hover:underline">
            Motoboys
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 hover:underline">
            Configurações
          </a>
        </nav>
        <div className="px-4 py-4 border-t border-gray-200 text-sm text-gray-500">
          © {new Date().getFullYear()} PlayDelivery
        </div>
      </aside>

      {/* Conteúdo principal */}
      <section className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Bem-vindo ao Painel Administrativo</h1>
        <p className="text-gray-700">
          Aqui você pode gerenciar lojas, entregadores, pedidos e configurações do sistema.
        </p>

        {/* Conteúdo futuro */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">Resumo de pedidos e desempenho será exibido aqui...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
