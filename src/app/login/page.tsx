'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/painel');
    } catch (err) {
      console.error(err);
      setErro('E-mail ou senha inválidos.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 text-gray-800">
      <div className="bg-white shadow rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Login</h1>

        {erro && <p className="text-red-500 text-sm mb-4 text-center">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
