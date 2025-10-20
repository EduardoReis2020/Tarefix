"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/dashboard');
      return;
    }
    setCanRender(true);
  }, [router]);

  if (!canRender) return null;
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  );
}
