/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

export default function EsqueciSenhaPage() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleConfirm = () => {
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-700 flex flex-col relative">
      {/* Topbar */}
      <header className="bg-gray-100 border-b border-gray-200 py-4 px-6 flex justify-between items-center text-gray-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo PlayDelivery" className="w-10 h-10" />
          <span className="text-xl font-bold text-blue-600">PlayDelivery</span>
        </div>
      </header>

      {/* Formulário */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
            Redefinir Senha
          </h1>

          <p className="text-sm text-gray-600 text-center mb-6">
            Informe seu e-mail e enviaremos instruções para redefinir sua senha.
          </p>

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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Enviar instruções
            </button>
          </form>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">
              Verifique seu e-mail
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Sua redefinição de senha será enviada ao seu e-mail.
            </p>
            <button
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

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
