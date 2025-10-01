"use client"
import React,{ useState, useEffect, useRef} from "react";
import Link from 'next/link'

const DashboardPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fechar modal quando clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Tarefix</h1>
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link href="/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    📋 Minhas Tarefas
                </Link>
                <Link href="/projects" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    📂 Projetos
                </Link>
                <Link href="/calendar" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    📅 Calendário
                </Link>
                <Link href="/reports" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    📊 Relatórios
                </Link>
            </nav>
        </aside>
        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            <div className="relative">
                <button
                onClick={openModal}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                Nome_Usuário
                </button>
                {isModalOpen && (
                <div
                    ref={modalRef}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64 z-50"
                >
                    <div className="space-y-2">
                    <Link
                        href="/profile"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Perfil
                    </Link>
                    <Link
                        href="/settings"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Configurações
                    </Link>
                    <hr className="my-2" />
                    <button
                        onClick={closeModal}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Sair
                    </button>
                    </div>
                </div>
                )}
            </div>
            </header>
            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tarefas em andamento</h3>
                        <p className="text-gray-600 text-sm">5 tarefas precisam da sua atenção</p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Projetos ativos</h3>
                        <p className="text-gray-600 text-sm">2 projetos em execução</p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios recentes</h3>
                        <p className="text-gray-600 text-sm">3 relatórios gerados essa semana</p>
                    </div>
                </div>
            </main>
            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 text-center text-gray-600">
                    &copy; 2024 Tarefix. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    </div>
    );
};

export default DashboardPage;
