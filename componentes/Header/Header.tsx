"use client"
import React from "react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const isAuthPage = ["/", "/register", "/login"].includes(pathname);

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
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Tarefix</h1>
                    </div>
                    {isAuthPage ? (
                        // Navegação para páginas públicas
                        <nav className="flex items-center space-x-4">
                            <div className="flex space-x-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Começar
                                </Link>
                            </div>
                        </nav>
                    ) : (
                        // Perfil do Usuário para páginas autenticadas
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
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
