/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode validar os dados se desejar
    router.push('/painel');
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-700 flex flex-col">
      {/* Topbar */}
      <header className="bg-gray-100 border-b border-gray-200 py-4 px-6 flex justify-between items-center text-gray-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo PlayDelivery" className="w-10 h-10" />
          <span className="text-xl font-bold text-blue-600">PlayDelivery</span>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
            Acesse sua conta
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
              <div className="text-right mt-1">
                <a href="/esqueci-senha" className="text-sm text-blue-600 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <p className="italic mb-2 text-gray-600">
          &quot;Os planos bem elaborados levam à fartura; mas o apressado sempre acaba na miséria.&quot; – Provérbios 21:5
        </p>
        <p>© {new Date().getFullYear()} PlayDelivery. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
