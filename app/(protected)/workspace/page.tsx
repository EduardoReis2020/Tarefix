"use client";
import React, { useEffect, useState } from "react";
import Header from "@/componentes/Header/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WorkspacePage = () => {
        const [teams, setTeams] = useState<Array<{ id: string; name: string; description?: string }>>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                if (!token) return;
                (async () => {
                        try {
                                const res = await fetch('/api/teams', {
                                        headers: { authorization: `Bearer ${token}` },
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error || 'Erro ao carregar times');
                                setTeams(data || []);
                        } catch (e) {
                                setError((e as Error).message);
                        } finally {
                                setLoading(false);
                        }
                })();
        }, []);

        const pathname = usePathname();
        const isDashboard = pathname === '/dashboard';
        const isWorkspace = pathname?.startsWith('/workspace');

        return (
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                        <Header />
                        <div className="flex flex-1">
                                {/* Sidebar */}
                                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                                        <nav className="space-y-2">
                                                <Link href="/dashboard" className={`block px-3 py-2 rounded-lg ${isDashboard ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Dashboard</Link>
                                                <Link href="/workspace" className={`block px-3 py-2 rounded-lg ${isWorkspace ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Equipes</Link>
                                        </nav>
                                </aside>

                                {/* Conteúdo principal */}
                                <main className="flex-1 p-6 space-y-4">
                                        <h1 className="text-2xl font-semibold text-gray-900">Equipes</h1>
                                        {loading && <p className="text-gray-600">Carregando equipes...</p>}
                                        {error && <p className="text-red-600">{error}</p>}
                                        {!loading && !error && (
                                                teams.length > 0 ? (
                                                        <>
                                                            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    {teams.map(team => (
                                                                            <li key={team.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                                                                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                                                                                    {team.description && <p className="text-sm text-gray-600 mt-1">{team.description}</p>}
                                                                                    <Link href={`/teams/${team.id}`} className="text-sm text-gray-700 mt-3 inline-flex items-center gap-1 hover:text-gray-900">
                                                                                        <span>Abrir equipe</span>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 10a1 1 0 0 1 1-1h9.586l-3.293-3.293a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L13.586 11H4a1 1 0 0 1-1-1Z"/></svg>
                                                                                    </Link>
                                                                            </li>
                                                                    ))}
                                                            </ul>
                                                            <div className="mt-8">
                                                                <CreateTeamButton />
                                                            </div>
                                                        </>
                                                ) : (
                                                        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                                                                <h3 className="text-xl font-semibold text-gray-900">Nenhuma equipe ainda</h3>
                                                                <p className="text-gray-600 mt-2">Crie sua primeira equipe para começar a organizar seu trabalho.</p>
                                                                <CreateTeamButton />
                                                        </div>
                                                )
                                        )}
                                </main>
                        </div>
                </div>
        );
};

export default WorkspacePage;

function CreateTeamButton() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createTeam() {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, ownerId: 'self' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Erro ao criar equipe');
            window.location.reload();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
                <div className="mt-4">
                        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                Criar equipe
            </button>
            {open && (
                                <div className="mt-4 text-left bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                        <div className="space-y-3">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome da equipe"
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição (opcional)"
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                                                <div className="flex gap-2 justify-end">
                                                        <button onClick={createTeam} disabled={loading} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-70">
                                {loading ? 'Criando...' : 'Criar'}
                            </button>
                                                        <button onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
