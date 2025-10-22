"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

type Task = {
	id: string;
	title: string;
	description?: string | null;
	status: "TODO" | "IN_PROGRESS" | "DONE" | "LATE";
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	startDate?: string | null;
	dueDate?: string | null;
	updatedAt: string;
	team?: { id: string; name: string } | null;
};

function formatDate(iso?: string | null) {
	if (!iso) return "-";
	const d = new Date(iso);
	return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function isSameDay(a: Date, b: Date) {
	return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}
function startOfWeek(d: Date) {
	const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
	const day = x.getUTCDay(); // 0..6 Domingo..Sábado
	const diff = (day + 6) % 7; // começar na segunda
	x.setUTCDate(x.getUTCDate() - diff);
	return x;
}
function isThisWeek(date: Date, today = new Date()) {
	const start = startOfWeek(today);
	const end = new Date(start);
	end.setUTCDate(start.getUTCDate() + 7);
	return date >= start && date < end;
}
function isWithinDays(date?: string | null, days = 7, ref?: Date) {
	if (!date) return false;
	const d = new Date(date);
	const today = ref ? new Date(ref) : new Date();
	const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
	end.setUTCDate(end.getUTCDate() + days);
	// considerar UTC sempre
	const dUTC = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
	const tUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
	return dUTC >= tUTC && dUTC <= end;
}

const DashboardPage = () => {
	const pathname = usePathname();
	const isDashboard = pathname === '/dashboard';
	const isWorkspace = pathname?.startsWith('/workspace');

	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		if (!token) { setLoading(false); return; }
		(async () => {
			try {
				const res = await fetch('/api/tasks', { headers: { authorization: `Bearer ${token}` } });
				const data = await res.json();
				if (!res.ok) throw new Error(data?.error || 'Erro ao carregar tarefas');
				setTasks(data || []);
			} catch (e) {
				setError((e as Error).message);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const computed = useMemo(() => {
		const today = new Date();
		const doneToday = tasks.filter(t => t.status === 'DONE' && isSameDay(new Date(t.updatedAt), today));
		const doneThisWeek = tasks.filter(t => t.status === 'DONE' && isThisWeek(new Date(t.updatedAt), today));
		const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
		const late = tasks.filter(t => t.status === 'LATE' || (!!t.dueDate && new Date(t.dueDate) < today && t.status !== 'DONE'));
		const dueSoon = tasks.filter(t => t.status !== 'DONE' && isWithinDays(t.dueDate, 7, today));
		return { doneToday, doneThisWeek, inProgress, late, dueSoon };
	}, [tasks]);

	// Agenda simples do mês atual com marcação de dueDate
	const todayCal = new Date();
	const month = todayCal.getUTCMonth();
	const year = todayCal.getUTCFullYear();
	const firstOfMonth = new Date(Date.UTC(year, month, 1));
	const firstWeekday = (firstOfMonth.getUTCDay() + 6) % 7; // segunda=0
	const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	const days: Array<{ day: number; hasTasks: boolean; items: Task[] }> = [];
	for (let i = 0; i < firstWeekday; i++) days.push({ day: 0, hasTasks: false, items: [] });
	for (let d = 1; d <= daysInMonth; d++) {
		const iso = new Date(Date.UTC(year, month, d)).toISOString();
		const items = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), new Date(iso)));
		days.push({ day: d, hasTasks: items.length > 0, items });
	}

	const Section = ({ title, items }: { title: string; items: Task[] }) => (
		<div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
				<span className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">{items.length}</span>
			</div>
			{items.length === 0 ? (
				<p className="text-sm text-gray-600">Nada por aqui.</p>
			) : (
				<ul className="space-y-2 max-h-64 overflow-auto pr-1">
					{items.map(t => (
						<li key={t.id} className="border border-gray-200 rounded-xl p-3 hover:shadow-sm bg-white">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="font-medium text-gray-900 truncate">{t.title}</p>
									<div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
										<span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold
											${t.status === "TODO" ? "bg-gray-200 text-gray-700" : t.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : t.status === "DONE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
										`}>
											{t.status === "TODO" ? "A fazer" : t.status === "IN_PROGRESS" ? "Em andamento" : t.status === "DONE" ? "Concluída" : "Atrasada"}
										</span>
										<span className="inline-flex items-center gap-1">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v1h16V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1Z"/><path d="M18 9H2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/></svg>
											{formatDate(t.dueDate)}
										</span>
										{t.team?.name && (
											<span className="inline-flex items-center gap-1">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3a4 4 0 1 1-3.465 6H3a1 1 0 1 1 0-2h3.035A4 4 0 0 1 10 3Zm-6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1Z"/></svg>
												{t.team.name}
											</span>
										)}
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);

	return (
	<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
		<Header />
		{/* Conteúdo principal */}
		<div className="flex-1 flex">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-gray-200 p-4">
				<nav className="space-y-2">
					<Link href="/dashboard" className={`block px-3 py-2 rounded-lg ${isDashboard ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Dashboard</Link>
					<Link href="/workspace" className={`block px-3 py-2 rounded-lg ${isWorkspace ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Workspace</Link>
				</nav>
			</aside>
			{/* Main Content */}
			<main className="flex-1 p-6 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
				</div>

				{loading && <p className="text-gray-600">Carregando…</p>}
				{error && <p className="text-red-600">{error}</p>}

				{!loading && !error && (
					<>
						{/* Métricas com listas */}
						<div className="grid lg:grid-cols-2 gap-6">
							<Section title="Tarefas concluídas hoje" items={computed.doneToday} />
							<Section title="Tarefas concluídas na semana" items={computed.doneThisWeek} />
						</div>
						<div className="grid lg:grid-cols-3 gap-6">
							<Section title="Em andamento" items={computed.inProgress} />
							<Section title="Atrasadas" items={computed.late} />
							<Section title="A vencer (7 dias)" items={computed.dueSoon} />
						</div>

						{/* Agenda com calendário simples */}
						<div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">Agenda</h3>
								<span className="text-sm text-gray-600">{todayCal.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
							</div>
							<div className="grid grid-cols-7 gap-1 text-xs text-gray-600 mb-2">
								{["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
									<div key={i} className="text-center py-1">{d}</div>
								))}
							</div>
							<div className="grid grid-cols-7 gap-2">
								{days.map((d, idx) => (
									<div key={idx} className={`aspect-square rounded-lg border ${d.day === 0 ? 'border-transparent' : 'border-gray-200'} p-1 flex flex-col items-center justify-center bg-white`}>
										{d.day > 0 && (
											<>
												<span className="text-xs text-gray-800">{d.day}</span>
												{d.hasTasks && <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-gray-800" />}
											</>
										)}
									</div>
								))}
							</div>
							{/* Próximas tarefas (lista curta) */}
							<div className="mt-4">
								<h4 className="text-sm font-semibold text-gray-900 mb-2">Próximas tarefas</h4>
								<ul className="space-y-1 text-sm">
									{tasks
										.filter(t => t.dueDate && new Date(t.dueDate) >= todayCal)
										.sort((a,b) => (new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()))
										.slice(0,8)
										.map(t => (
										<li key={t.id} className="flex items-center justify-between">
											<span className="truncate mr-2">{t.title}</span>
											<span className="text-gray-600">{formatDate(t.dueDate)}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</>
				)}
			</main>
		</div>
		{/* Footer */}
		<Footer />
	</div>
	);
};

export default DashboardPage;
