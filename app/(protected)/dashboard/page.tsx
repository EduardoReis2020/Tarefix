"use client";
import React from "react";
import Link from 'next/link'
import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

const DashboardPage = () => {

	return (
	<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
		<Header />
		{/* Conteúdo principal */}
		<div className="flex-1 flex flex-grow">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
			{/* Main Content */}
			<main className="flex-1 p-6 ">
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
		</div>
		{/* Footer */}
		<Footer />
	</div>
	);
};

export default DashboardPage;
