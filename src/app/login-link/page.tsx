'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginLinkPage() {
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('emailParaLogin');

    if (isSignInWithEmailLink(auth, window.location.href) && email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          localStorage.removeItem('emailParaLogin');
          router.push('/painel');
        })
        .catch(() => {
          alert('Erro ao autenticar. Link inválido ou expirado.');
        });
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-700">Validando link de login...</p>
    </main>
  );
}
