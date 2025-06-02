/* eslint-disable @next/next/no-img-element */
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-700">
      {/* Topbar */}
      <header className="bg-gray-100 border-b border-gray-200 py-4 px-6 flex justify-between items-center text-gray-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo PlayDelivery" className="w-10 h-10" />
          <span className="text-xl font-bold text-blue-600">PlayDelivery</span>
        </div>
        <a
          href="/login"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Entrar
        </a>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center bg-white shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Sua gestão de entregas, simplificada.
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto mb-8">
          Controle pedidos, acompanhe entregadores e gerencie lojas — tudo em um
          só lugar com o PlayDelivery.
        </p>

        <div className="max-w-4xl mx-auto">
          <img
            src="/banner.png"
            alt="Ilustração PlayDelivery"
            className="rounded-xl shadow-md w-full max-h-[50vh] object-cover mx-auto"
          />
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Painel Administrativo
          </h2>
          <p>
            Visualize métricas, pedidos em tempo real e acesse dados
            consolidados de entrega.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Gestão de Lojas
          </h2>
          <p>
            Gerencie múltiplas lojas, horários de funcionamento, cardápios e
            pedidos simultâneos.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Motoboys e Roteiros
          </h2>
          <p>
            Rastreie entregadores, organize rotas otimizadas e envie
            notificações instantâneas.
          </p>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <p className="italic mb-2 text-gray-600">
          &quot;Os planos bem elaborados levam à fartura; mas o apressado sempre
          acaba na miséria.&quot; – Provérbios 21:5
        </p>
        <p>
          © {new Date().getFullYear()} PlayDelivery. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}
