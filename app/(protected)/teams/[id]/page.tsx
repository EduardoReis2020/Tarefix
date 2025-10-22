"use client";
import React, { useEffect, useMemo, useState } from "react";
import Header from "@/componentes/Header/Header";
import Link from "next/link";
import { useParams } from "next/navigation";

type Task = {
    id: string;
    title: string;
    description?: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE" | "LATE";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    startDate?: string | null;
    dueDate?: string | null;
};

export default function TeamPage() {
    const params = useParams();
    const teamId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
    const formatDate = (iso?: string | null) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"list" | "board" | "calendar" | "table">("list");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        (async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/tasks?teamId=${teamId}`, {
            headers: { authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Erro ao carregar tarefas");
            setTasks(data || []);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
        })();
    }, [teamId]);

    function openCreateModal() {
        setEditingTask(null);
        setModalOpen(true);
    }
    function openEditModal(task: Task) {
        setEditingTask(task);
        setModalOpen(true);
    }
    function closeModal() {
        setModalOpen(false);
    }

    async function handleSaveTask(input: { title: string; description?: string; priority?: Task["priority"]; startDate?: string; dueDate?: string; status?: Task["status"]; }) {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
        if (editingTask) {
            const res = await fetch(`/api/tasks/${editingTask.id}`, {
                method: "PATCH",
                headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
                body: JSON.stringify(input),
            });
            const text = await res.text();
            let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch { data = null; }
            const errMsg = (data && typeof data === 'object' && 'error' in data) ? (data as { error?: string }).error : undefined;
            if (!res.ok) throw new Error(errMsg || "Erro ao atualizar tarefa");
        } else {
            // Na criação, não enviar 'status' (backend define como TODO/A fazer por padrão)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { status: _omit, ...createInput } = input;
            const res = await fetch(`/api/tasks`, {
                method: "POST",
                headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...createInput, teamId }),
            });
            const text = await res.text();
            let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch { data = null; }
            const errMsg = (data && typeof data === 'object' && 'error' in data) ? (data as { error?: string }).error : undefined;
            if (!res.ok) throw new Error(errMsg || "Erro ao criar tarefa");
        }
        // reload list
        const resList = await fetch(`/api/tasks?teamId=${teamId}`, { headers: { authorization: `Bearer ${token}` } });
        const list = await resList.json();
        setTasks(list || []);
        setModalOpen(false);
        } catch (e) {
            alert((e as Error).message);
        }
    }

    const grouped = useMemo(() => {
        return {
            TODO: tasks.filter(t => t.status === "TODO"),
            IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
            DONE: tasks.filter(t => t.status === "DONE"),
            LATE: tasks.filter(t => t.status === "LATE"),
        };
    }, [tasks]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex flex-1">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-2">
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Dashboard</Link>
                <Link href="/workspace" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Workspace</Link>
            </nav>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Equipe</h1>
                <div className="flex gap-2">
                <button onClick={openCreateModal} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Nova tarefa</button>
                <select value={view} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setView(e.target.value as "list" | "board" | "calendar" | "table")} className="border rounded-lg px-3 py-2">
                    <option value="list">Lista</option>
                    <option value="board">Quadro</option>
                    <option value="calendar">Calendário</option>
                    <option value="table">Tabela</option>
                </select>
                </div>
            </div>

            {loading && <p className="text-gray-600">Carregando…</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <div>
                {view === "list" && (
                    <ul className="space-y-2">
                    {tasks.map(t => (
                        <li key={t.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900">{t.title}</p>
                            {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                        </div>
                        <button onClick={() => openEditModal(t)} className="text-sm text-gray-700 hover:underline">Editar</button>
                        </li>
                    ))}
                    </ul>
                )}

                {view === "board" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(["TODO","IN_PROGRESS","DONE","LATE"] as const).map(col => (
                        <div key={col} className="bg-white border border-gray-200 rounded-lg p-3">
                        <h3 className="font-semibold text-gray-900 mb-2">{col.replace('_',' ')}</h3>
                        <div className="space-y-2">
                            {grouped[col].map(t => (
                            <div key={t.id} className="border rounded p-3 hover:shadow cursor-pointer" onClick={() => openEditModal(t)}>
                                <p className="font-medium">{t.title}</p>
                                {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                {view === "calendar" && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Calendário simples (visual):
                        mostra tarefas com dueDate. Para produção, integrar biblioteca de calendário.</p>
                    <ul className="mt-2 space-y-1">
                        {tasks.filter(t => !!t.dueDate).map(t => (
                        <li key={t.id} className="flex justify-between">
                            <span>{t.title}</span>
                            <span className="text-gray-500 text-sm">{formatDate(t.dueDate!)}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}

                {view === "table" && (
                    <div className="overflow-x-auto bg-white shadow-sm border border-gray-200 rounded-xl">
                        <table className="min-w-full text-sm text-gray-800">
                            <thead className="sticky top-0 bg-gray-100 text-xs uppercase tracking-wide border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">Título</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">Prioridade</th>
                                <th className="px-3 py-2 text-left">Início</th>
                                <th className="px-3 py-2 text-left">Entrega</th>
                                <th className="px-3 py-2 text-right"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map(t => (
                                <tr key={t.id} className="border-b border-gray-400 last:border-none hover:bg-gray-50 transition-colors">
                                {/* Título */}
                                <td className="px-4 py-3 font-medium text-gray-900">{t.title}</td>

                                {/* Status com cores */}
                                <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                    ${
                                        t.status === "TODO"
                                        ? "bg-gray-200 text-gray-700"
                                        : t.status === "IN_PROGRESS"
                                        ? "bg-blue-100 text-blue-700"
                                        : t.status === "DONE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {t.status === "TODO"
                                    ? "A fazer"
                                    : t.status === "IN_PROGRESS"
                                    ? "Em andamento"
                                    : t.status === "DONE"
                                    ? "Concluída"
                                    : "Atrasada"}
                                </span>
                                </td>

                                {/* Prioridade com cores */}
                                <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                    ${
                                        t.priority === "LOW"
                                        ? "bg-gray-100 text-gray-700"
                                        : t.priority === "MEDIUM"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : t.priority === "HIGH"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {t.priority === "LOW"
                                    ? "Baixa"
                                    : t.priority === "MEDIUM"
                                    ? "Média"
                                    : t.priority === "HIGH"
                                    ? "Alta"
                                    : "Crítica"}
                                </span>
                                </td>

                                {/* Datas */}
                                <td className="px-4 py-3 text-gray-600">
                                {formatDate(t.startDate)}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                {formatDate(t.dueDate)}
                                </td>

                                {/* Ações */}
                                <td className="px-4 py-3 text-right">
                                <button
                                    onClick={() => openEditModal(t)}
                                    className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
                                >
                                    Editar
                                </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                </div>
            )}
            </main>
        </div>

        {modalOpen && (
            <TaskModal
            task={editingTask}
            onClose={closeModal}
            onSave={handleSaveTask}
            />
        )}
        {/* Botão flutuante para criar tarefa (sempre visível) */}
        <button
            onClick={openCreateModal}
            className="fixed bottom-6 right-6 z-10 rounded-full bg-gray-900 text-white px-5 py-3 shadow-lg hover:bg-gray-800"
            aria-label="Nova tarefa"
        >
            Nova tarefa
        </button>
        </div>
    );
}

function TaskModal({ task, onClose, onSave }: { task: Task | null; onClose: () => void; onSave: (input: { title: string; description?: string; priority?: Task["priority"]; startDate?: string; dueDate?: string; status?: Task["status"]; }) => void }) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [priority, setPriority] = useState<Task["priority"]>(task?.priority || "MEDIUM");
    const [status, setStatus] = useState<Task["status"]>(task?.status || "TODO");
    const [startDate, setStartDate] = useState<string>(task?.startDate ? task.startDate.substring(0,10) : "");
    const [dueDate, setDueDate] = useState<string>(task?.dueDate ? task.dueDate.substring(0,10) : "");

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-lg p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
            <div className="space-y-2">
            <input className="w-full border rounded px-3 py-2" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
                <div>
                <label className="block text-xs text-gray-600">Prioridade</label>
                <select className="w-full border rounded px-2 py-2" value={priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Task["priority"])}>
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                </select>
                </div>
                                {task && (
                                    <div>
                                        <label className="block text-xs text-gray-600">Status</label>
                                        <select className="w-full border rounded px-2 py-2" value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Task["status"])}>
                                                <option value="TODO">A fazer</option>
                                                <option value="IN_PROGRESS">Em andamento</option>
                                                <option value="DONE">Concluída</option>
                                                <option value="LATE">Atrasada</option>
                                        </select>
                                    </div>
                                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                <label className="block text-xs text-gray-600">Início</label>
                <input type="date" className="w-full border rounded px-2 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                <label className="block text-xs text-gray-600">Entrega</label>
                <input type="date" className="w-full border rounded px-2 py-2" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
            </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button onClick={() => onSave({ title, description, priority, startDate, dueDate, status })} className="px-4 py-2 bg-gray-900 text-white rounded">Salvar</button>
            </div>
        </div>
        </div>
    );
}
