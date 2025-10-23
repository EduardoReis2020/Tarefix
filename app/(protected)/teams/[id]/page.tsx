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
    order?: number | null;
    assignees?: Array<{ id: string; name: string }>;
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
    const [teamName, setTeamName] = useState<string>("Equipe");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"list" | "board" | "calendar" | "table">("list");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    // Calendário: mês corrente como primeiro dia do mês em UTC
    const [monthCursor, setMonthCursor] = useState<Date>(() => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        (async () => {
            setLoading(true);
            try {
                const [resTasks, resTeam] = await Promise.all([
                    fetch(`/api/tasks?teamId=${teamId}`, { headers: { authorization: `Bearer ${token}` } }),
                    fetch(`/api/teams/${teamId}`, { headers: { authorization: `Bearer ${token}` } }),
                ]);
                const tasksJson = await resTasks.json();
                const teamJson = await resTeam.json();
                if (!resTasks.ok) throw new Error(tasksJson?.error || "Erro ao carregar tarefas");
                if (!resTeam.ok) throw new Error(teamJson?.error || "Erro ao carregar equipe");
                setTasks(tasksJson || []);
                setTeamName(teamJson?.name || "Equipe");
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

    // Drag & Drop (Board)
    const onDragStart = (task: Task) => (e: React.DragEvent) => {
        e.dataTransfer.setData("application/x-task-id", task.id);
        e.dataTransfer.effectAllowed = "move";
    };
    const onDragOverColumn = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };
    // Reatribui ordem sequencial e persiste no backend
    const renumberAndPersist = async (status: Task["status"], list: Task[]) => {
        // Reatribui ordem sequencial por passos de 10 e persiste
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Sem token");
        let idx = 0;
        for (const t of list) {
            const nextOrder = idx * 10;
            idx++;
            if (t.order !== nextOrder || t.status !== status) {
                await fetch(`/api/tasks/${t.id}`, {
                    method: "PATCH",
                    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
                    body: JSON.stringify({ order: nextOrder, status }),
                });
                t.order = nextOrder;
                t.status = status;
            }
        }
    };

    const onDropToColumn = (newStatus: Task["status"]) => async (e: React.DragEvent) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("application/x-task-id");
        if (!id) return;
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const prev = [...tasks];

        // Constrói nova lista com reordenação dentro da coluna alvo
        const without = tasks.filter(t => t.id !== id);
        const targetList = without.filter(t => (newStatus ? t.status === newStatus : t.status === task.status));
        const other = without.filter(t => (newStatus ? t.status !== newStatus : t.status !== task.status));

        const insertIndex = dragOverId && targetList.find(x => x.id === dragOverId)
            ? targetList.findIndex(x => x.id === dragOverId)
            : targetList.length; // fim

        const moved: Task = { ...task, status: newStatus };
        const newTarget = [
            ...targetList.slice(0, insertIndex),
            moved,
            ...targetList.slice(insertIndex),
        ];
        const nextTasks = [...other, ...newTarget];
        setDragOverId(null);
        setTasks(nextTasks);
        try {
            // RENUMERA e persiste somente a coluna de destino com base na lista calculada
            const target = newTarget;
            await renumberAndPersist(newStatus, target);
        } catch (err) {
            setTasks(prev);
            alert((err as Error).message);
        }
    };

    const onCardDragEnter = (id: string) => (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverId(id);
    };
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex flex-1">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-2">
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Dashboard</Link>
                <Link href="/workspace" className="block px-3 py-2 rounded-lg bg-gray-900 text-white">Equipes</Link>
            </nav>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">{teamName}</h1>
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
                

                {view === "board" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {(["TODO","IN_PROGRESS","DONE","LATE"] as const).map((col) => (
                            <div
                                key={col}
                                onDragOver={onDragOverColumn}
                                onDrop={onDropToColumn(col)}
                                className={`rounded-2xl border p-3 min-h-[320px] flex flex-col gap-3 transition-colors
                                    ${col === "TODO" ? "bg-gray-50 border-gray-200" : ""}
                                    ${col === "IN_PROGRESS" ? "bg-blue-50 border-blue-200" : ""}
                                    ${col === "DONE" ? "bg-green-50 border-green-200" : ""}
                                    ${col === "LATE" ? "bg-red-50 border-red-200" : ""}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 uppercase text-xs tracking-wide">
                                        {col === "TODO" ? "A fazer" : col === "IN_PROGRESS" ? "Em andamento" : col === "DONE" ? "Concluída" : "Atrasada"}
                                    </h3>
                                    <span className="text-[11px] text-gray-700 bg-white/60 border rounded-full px-2 py-0.5">
                                        {grouped[col].length}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-3 rounded-xl border-2 border-dashed border-transparent hover:border-gray-300/70 p-1">
                                    {grouped[col].map(t => (
                                        <div
                                            key={t.id}
                                            draggable
                                            onDragStart={onDragStart(t)}
                                            onDragEnter={onCardDragEnter(t.id)}
                                            onDoubleClick={() => openEditModal(t)}
                                            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-2">{t.title}</p>
                                                <div className="shrink-0 flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                                                        title="Editar"
                                                        className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.506l-3 1a1 1 0 0 1-1.265-1.265l1-3a2 2 0 0 1 .506-.878l8.5-8.5Z"/><path d="M5 13l2 2"/></svg>
                                                    </button>
                                                    <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold
                                                        ${t.priority === "LOW" ? "bg-gray-100 text-gray-700" : ""}
                                                        ${t.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : ""}
                                                        ${t.priority === "HIGH" ? "bg-orange-100 text-orange-800" : ""}
                                                        ${t.priority === "CRITICAL" ? "bg-red-100 text-red-800" : ""}
                                                    `}>
                                                        {t.priority === "LOW" ? "Baixa" : t.priority === "MEDIUM" ? "Média" : t.priority === "HIGH" ? "Alta" : "Crítica"}
                                                    </span>
                                                </div>
                                            </div>
                                            {t.description && (
                                                <p className="mt-1 text-xs text-gray-600 line-clamp-2">{t.description}</p>
                                            )}
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="flex items-center gap-1 text-[11px] text-gray-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v1h16V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1Z"/><path d="M18 9H2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/></svg>
                                                    {formatDate(t.dueDate)}
                                                </span>
                                                <div className="flex -space-x-2">
                                                    {(t.assignees || []).slice(0,3).map(u => (
                                                        <div key={u.id} className="w-6 h-6 rounded-full bg-gray-800 text-white text-[10px] flex items-center justify-center ring-2 ring-white" title={u.name}>
                                                            {u.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {view === "list" && (
                    <ul className="space-y-2">
                        {tasks.map(t => (
                            <li key={t.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0" onClick={() => openEditModal(t)}>
                                        <p className="font-medium text-gray-900 cursor-pointer hover:underline">{t.title}</p>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold
                                                ${t.status === "TODO" ? "bg-gray-200 text-gray-700" : t.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : t.status === "DONE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                            `}>
                                                {t.status === "TODO" ? "A fazer" : t.status === "IN_PROGRESS" ? "Em andamento" : t.status === "DONE" ? "Concluída" : "Atrasada"}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold
                                                ${t.priority === "LOW" ? "bg-gray-100 text-gray-700" : t.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : t.priority === "HIGH" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}
                                            `}>
                                                {t.priority === "LOW" ? "Baixa" : t.priority === "MEDIUM" ? "Média" : t.priority === "HIGH" ? "Alta" : "Crítica"}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v1h16V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1Z"/><path d="M18 9H2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/></svg>
                                                {formatDate(t.dueDate)}
                                            </span>
                                        </div>
                                        {t.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{t.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {(t.assignees || []).slice(0,3).map(u => (
                                                <div key={u.id} className="w-7 h-7 rounded-full bg-gray-800 text-white text-[10px] flex items-center justify-center ring-2 ring-white" title={u.name}>
                                                    {u.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => openEditModal(t)}
                                            title="Editar"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.506l-3 1a1 1 0 0 1-1.265-1.265l1-3a2 2 0 0 1 .506-.878l8.5-8.5Z"/><path d="M5 13l2 2"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {view === "calendar" && (
                    <TeamCalendar
                        monthCursor={monthCursor}
                        setMonthCursor={setMonthCursor}
                        tasks={tasks}
                        onTaskClick={openEditModal}
                        onDayDoubleClick={() => openCreateModal()}
                    />
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
                                <th className="px-3 py-2 text-left">Atribuídos</th>
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
                                <td className="px-4 py-3 text-gray-600">{formatDate(t.dueDate)}</td>

                                {/* Atribuídos */}
                                <td className="px-4 py-3">
                                    <div className="flex -space-x-2">
                                        {(t.assignees || []).slice(0,5).map(u => (
                                            <div key={u.id} className="w-7 h-7 rounded-full bg-gray-800 text-white text-[10px] flex items-center justify-center ring-2 ring-white" title={u.name}>
                                                {u.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                </td>

                                {/* Ações */}
                                <td className="px-4 py-3 text-right">
                                <button
                                    onClick={() => openEditModal(t)}
                                    title="Editar"
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.506l-3 1a1 1 0 0 1-1.265-1.265l1-3a2 2 0 0 1 .506-.878l8.5-8.5Z"/><path d="M5 13l2 2"/></svg>
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
        <div className="bg-white w-full max-w-lg rounded-xl p-5 space-y-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
            <div className="space-y-3">
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
                <div>
                <label className="block text-xs text-gray-600">Prioridade</label>
                <select className="w-full border border-gray-200 rounded-lg px-2 py-2" value={priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Task["priority"])}>
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                </select>
                </div>
                {task && (
                    <div>
                        <label className="block text-xs text-gray-600">Status</label>
                        <select className="w-full border border-gray-200 rounded-lg px-2 py-2" value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Task["status"]) }>
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
                <input type="date" className="w-full border border-gray-200 rounded-lg px-2 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                <label className="block text-xs text-gray-600">Entrega</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-2 py-2" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
            </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button onClick={() => onSave({ title, description, priority, startDate, dueDate, status })} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Salvar</button>
            </div>
        </div>
        </div>
    );
}

type TeamCalendarProps = {
    monthCursor: Date;
    setMonthCursor: (d: Date) => void;
    tasks: Task[];
    onTaskClick: (t: Task) => void;
    onDayDoubleClick?: (d: Date) => void;
};

function TeamCalendar({ monthCursor, setMonthCursor, tasks, onTaskClick, onDayDoubleClick }: TeamCalendarProps) {
    // Helpers UTC
    const isSameUTCDay = (a: Date, b: Date) => (
        a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate()
    );
    const startOfWeekUTC = (d: Date) => {
        const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        const day = x.getUTCDay(); // 0..6 Domingo..Sábado
        const diff = (day + 6) % 7; // começar na segunda
        x.setUTCDate(x.getUTCDate() - diff);
        return x;
    };
    const addMonthsUTC = (d: Date, delta: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1));

    const firstOfMonth = new Date(Date.UTC(monthCursor.getUTCFullYear(), monthCursor.getUTCMonth(), 1));
    const startGrid = startOfWeekUTC(firstOfMonth);
    const cells: Array<{ date: Date; inMonth: boolean; isToday: boolean; items: Task[] }> = [];
    const todayLocal = new Date();
    const todayLocalAsUTC = new Date(Date.UTC(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate()));
    for (let i = 0; i < 42; i++) {
        const d = new Date(Date.UTC(startGrid.getUTCFullYear(), startGrid.getUTCMonth(), startGrid.getUTCDate() + i));
        const inMonth = d.getUTCMonth() === firstOfMonth.getUTCMonth();
        // Hoje baseado no dia local do usuário
        const isToday = isSameUTCDay(d, todayLocalAsUTC);
        const items = tasks.filter(t => t.dueDate && isSameUTCDay(new Date(t.dueDate), d));
        cells.push({ date: d, inMonth, isToday, items });
    }

    const monthLabel = firstOfMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

    const statusClasses = (s: Task["status"]) => (
        s === "TODO" ? "bg-gray-100 text-gray-700 border-gray-200" :
        s === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
        s === "DONE" ? "bg-green-50 text-green-700 border-green-200" :
        "bg-red-50 text-red-700 border-red-200"
    );

    // Expansão de dia para mostrar todas as tarefas
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const keyFromDate = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMonthCursor(addMonthsUTC(monthCursor, -1))}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                        title="Mês anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.78 15.53a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 1 1 1.06 1.06L8.81 10l3.97 3.97a.75.75 0 0 1 0 1.06Z" clipRule="evenodd"/></svg>
                    </button>
                    <button
                        onClick={() => setMonthCursor(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)))}
                        className="px-3 h-8 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >Hoje</button>
                    <button
                        onClick={() => setMonthCursor(addMonthsUTC(monthCursor, 1))}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                        title="Próximo mês"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.22 4.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L11.19 10 7.22 6.03a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/></svg>
                    </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{monthLabel}</h3>
                <div className="w-8" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-600 mb-2">
                {["S","T","Q","Q","S","S","D"].map((d,i) => (
                    <div key={i} className="text-center py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {cells.map((c, idx) => {
                    const k = keyFromDate(c.date);
                    const isExpanded = expandedKey === k;
                    const visibleItems = isExpanded ? c.items : c.items.slice(0,3);
                    return (
                        <div
                            key={idx}
                            onDoubleClick={() => onDayDoubleClick?.(c.date)}
                            onClick={() => {
                                if (c.items.length > 3) setExpandedKey(isExpanded ? null : k);
                            }}
                            className={`rounded-xl border p-2 ${isExpanded ? 'min-h-[140px]' : 'min-h-[110px]'} bg-white flex flex-col ${c.inMonth ? 'border-gray-200' : 'border-transparent opacity-60'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`text-xs ${c.inMonth ? 'text-gray-800' : 'text-gray-400'}`}>{c.date.getUTCDate()}</span>
                                {c.isToday && <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-gray-900 text-white">Hoje</span>}
                            </div>
                            <div className="mt-1 space-y-1">
                                {visibleItems.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={(e) => { e.stopPropagation(); onTaskClick(t); }}
                                        className={`w-full text-left truncate border rounded-md px-2 py-1 text-[11px] ${statusClasses(t.status)}`}
                                        title={t.title}
                                    >
                                        {t.title}
                                    </button>
                                ))}
                                {c.items.length > 3 && !isExpanded && (
                                    <span className="text-[11px] text-gray-600">+{c.items.length - 3} tarefas</span>
                                )}
                                {c.items.length > 3 && isExpanded && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setExpandedKey(null); }}
                                        className="text-[11px] text-gray-600 underline"
                                    >Mostrar menos</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
