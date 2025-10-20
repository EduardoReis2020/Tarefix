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