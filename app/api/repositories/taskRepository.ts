import prisma from "../../../lib/prisma";

// Criação de nova tarefa
export async function createTask(
    data: {
        title: string;
        description?: string;
        teamId: string;
        startDate?: Date;
        dueDate?: Date;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        order?: number;
    }) {

    return prisma.task.create({
        data,
    });
}

// Busca tarefa pelo ID
export async function findTaskById(taskId: string) {
    return prisma.task.findUnique({
        where: { id: taskId },
        include: {
            assignees: true,
            comments: true,
            tags: true,
            team: true,
        },
    });
}

// Busca todas as tarefas de um time
export async function findTasksByTeam(teamId: string) {
    return prisma.task.findMany({
        where: { teamId },
        include: {
            assignees: true,
            comments: true,
            tags: true,
        },
        orderBy: [
            { order: "asc" },
            { createdAt: "asc" },
        ],
    });
}

// Busca todas as tarefas atribuídas a um usuário
export async function findTasksByUser(userId: string) {
    return prisma.task.findMany({
        where: { assignees: { some: { id: userId } } },
        include: {
            assignees: true,
            comments: true,
            tags: true,
            team: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

// Busca todas as tarefas dos times em que o usuário é membro
export async function findTasksForUserTeams(userId: string) {
    return prisma.task.findMany({
        where: {
            team: {
                memberships: {
                    some: { userId },
                },
            },
        },
        include: {
            assignees: true,
            comments: true,
            tags: true,
            team: true,
        },
        orderBy: [
            { dueDate: "asc" },
            { createdAt: "desc" },
        ],
    });
}

// Marca como LATE todas as tarefas de um time cujo prazo já passou e não estão concluídas
export async function markOverdueTasksLateForTeam(teamId: string) {
    const now = new Date();
    await prisma.task.updateMany({
        where: {
            teamId,
            dueDate: { lt: now },
            status: { notIn: ["DONE", "LATE"] },
        },
        data: { status: "LATE" },
    });
}

// Marca como LATE as tarefas dos times em que o usuário é membro, cujo prazo passou e não estão concluídas
export async function markOverdueTasksLateForUserTeams(userId: string) {
    const now = new Date();
    // Busca IDs das tarefas a atualizar (para evitar uso de filtros relacionais em updateMany em alguns ambientes)
    const overdue = await prisma.task.findMany({
        where: {
            dueDate: { lt: now },
            status: { notIn: ["DONE", "LATE"] },
            team: {
                memberships: {
                    some: { userId },
                },
            },
        },
        select: { id: true },
    });
    if (overdue.length === 0) return;
    await prisma.task.updateMany({
        where: { id: { in: overdue.map(o => o.id) } },
        data: { status: "LATE" },
    });
}

// Atualiza uma tarefa
export async function updateTask(
    taskId: string, 
    data: Partial<{
        title: string;
        description: string;
        status: "TODO" | "IN_PROGRESS" | "DONE" | "LATE";
        priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        startDate: Date;
        dueDate: Date;
        order: number;
    }>) {

    return prisma.task.update({
        where: { id: taskId },
        data,
    });
}

// Deleta uma tarefa
export async function deleteTask(taskId: string) {
    return prisma.task.delete({
        where: { id: taskId },
    });
}

// Atribui um usuário a uma tarefa
export async function assignUserToTask(taskId: string, userId: string) {
    return prisma.task.update({
        where: { id: taskId },
        data: {
        assignees: { connect: { id: userId } },
        },
    });
}

// Remove um usuário de uma tarefa
export async function removeUserFromTask(taskId: string, userId: string) {
    return prisma.task.update({
        where: { id: taskId },
        data: {
        assignees: { disconnect: { id: userId } },
        },
    });
}