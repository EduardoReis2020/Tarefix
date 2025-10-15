import * as taskRepo from "../repositories/taskRepository";
import { findMembershipByUserAndTeam } from "../repositories/membershipRepository";

// Buscar tarefas de um usuário
export async function getTasksForUserService(userId: string) {
    if (!userId) throw new Error("ID de usuário é obrigatório.");
    return taskRepo.findTasksByUser(userId);
}

// Buscar tarefas de um time
export async function getTasksByTeamService(teamId: string) {
    if (!teamId) throw new Error("ID do time é obrigatório.");
    return taskRepo.findTasksByTeam(teamId);
}

// Buscar tarefa por ID
export async function getTaskByIdService(taskId: string) {
    if (!taskId) throw new Error("ID da tarefa é obrigatório.");
    const task = await taskRepo.findTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada.");
    return task;
}

// Criação de tarefa
export async function createTaskService(
    userId: string, 
    data: {
        title: string;
        description?: string;
        teamId: string;
        startDate?: Date;
        dueDate?: Date;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    }) {
    // Verifica se o usuário pertence ao time
    const membership = await findMembershipByUserAndTeam(userId, data.teamId);
    if (!membership || membership.role === "READONLY") {
        throw new Error("Usuário não tem permissão para criar tarefas nesse time.");
    }

    // Valida datas
    if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
        throw new Error("A data de início não pode ser maior que a data de término.");
    }

    return taskRepo.createTask(data);
}

// Atualização de tarefa
export async function updateTaskService(
    userId: string, 
    taskId: string, 
    data: Partial<{
        title: string;
        description: string;
        status: "TODO" | "IN_PROGRESS" | "DONE" | "LATE";
        priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        startDate: Date;
        dueDate: Date;
    }>) {
    const task = await taskRepo.findTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    // Verifica permissão
    const membership = await findMembershipByUserAndTeam(userId, task.teamId);
    if (!membership) throw new Error("Usuário não pertence ao time.");
    if (membership.role === "READONLY") throw new Error("Usuário não tem permissão para atualizar a tarefa.");
    if (membership.role === "MEMBER" && !task.assignees.some(a => a.id === userId)) {
        throw new Error("Usuário só pode atualizar tarefas que lhe foram atribuídas.");
    }

    // Atualiza status para LATE se necessário
    if (data.dueDate && data.status !== "DONE" && data.dueDate < new Date()) {
        data.status = "LATE";
    }

    return taskRepo.updateTask(taskId, data);
}

// Deleção de tarefa
export async function deleteTaskService(userId: string, taskId: string) {
    const task = await taskRepo.findTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    const membership = await findMembershipByUserAndTeam(userId, task.teamId);
    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Apenas administradores podem deletar tarefas.");
    }

    return taskRepo.deleteTask(taskId);
}

// Atribuição de usuário
export async function assignUserToTaskService(userId: string, taskId: string, assigneeId: string) {
    const task = await taskRepo.findTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    const membership = await findMembershipByUserAndTeam(userId, task.teamId);
    if (!membership || membership.role === "READONLY") {
        throw new Error("Usuário não tem permissão para atribuir membros.");
    }

    // Verifica se o usuário a ser atribuído pertence ao time
    const assigneeMembership = await findMembershipByUserAndTeam(assigneeId, task.teamId);
    if (!assigneeMembership) throw new Error("Usuário não pertence ao time.");

    return taskRepo.assignUserToTask(taskId, assigneeId);
}