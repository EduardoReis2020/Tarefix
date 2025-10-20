"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }
    // Opcional: garantir workspace após login
    (async () => {
      try {
        await fetch('/api/workspace', {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });
      } catch {
        // silencioso; não deve bloquear a UI
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  );
}
