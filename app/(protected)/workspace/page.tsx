"use client";
import React, { useEffect, useState } from "react";
import Header from "@/componentes/Header/Header";
import Link from "next/link";

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

        return (
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                        <Header />
                        <div className="flex flex-1">
                                {/* Sidebar */}
                                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                                        <nav className="space-y-2">
                                                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Dashboard</Link>
                                                <Link href="/workspace" className="block px-3 py-2 rounded-lg bg-gray-900 text-white">Workspace</Link>
                                        </nav>
                                </aside>

                                {/* Conteúdo principal */}
                                <main className="flex-1 p-6">
                                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Times</h1>
                                        {loading && <p className="text-gray-600">Carregando times...</p>}
                                        {error && <p className="text-red-600">{error}</p>}
                                        {!loading && !error && (
                                                teams.length > 0 ? (
                                                        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {teams.map(team => (
                                                                        <li key={team.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm">
                                                                                <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                                                                                {team.description && <p className="text-sm text-gray-600 mt-1">{team.description}</p>}
                                                                                <Link href={`/teams/${team.id}`} className="text-sm text-gray-700 mt-3 inline-flex items-center hover:underline">
                                                                                        Abrir equipe →
                                                                                </Link>
                                                                        </li>
                                                                ))}
                                                        </ul>
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
                <div className="mt-4 text-left">
                    <div className="space-y-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome da equipe"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição (opcional)"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div className="flex gap-2">
                            <button onClick={createTeam} disabled={loading} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-70">
                                {loading ? 'Criando...' : 'Criar'}
                            </button>
                            <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
