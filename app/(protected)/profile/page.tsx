"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-2">Em breve: edição de dados, segurança e preferências.</p>
      </main>
      <Footer />
    </div>
  );
}
