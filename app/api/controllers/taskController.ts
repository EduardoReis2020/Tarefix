import { NextResponse } from "next/server";
import * as taskService from "../services/taskService";

export async function getTasksController(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        // Se for necessário listar por time, aceitar query param (ex: ?teamId=...)
        const url = new URL(req.url);
        const teamId = url.searchParams.get("teamId") || undefined;

        if (teamId) {
            const tasks = await taskService.getTasksByTeamService(teamId);
            return NextResponse.json(tasks, { status: 200 });
        }

        const tasks = await taskService.getTasksForUserService(userId);
        return NextResponse.json(tasks, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function createTaskController(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const data = await req.json();
        const task = await taskService.createTaskService(userId, data);
        return NextResponse.json(task, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function updateTaskController(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const data = await req.json();
        const task = await taskService.updateTaskService(userId, params.id, data);
        return NextResponse.json(task, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function deleteTaskController(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        await taskService.deleteTaskService(userId, params.id);
        return NextResponse.json({ message: "Tarefa deletada" }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function getTaskByIdController(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const task = await taskService.getTaskByIdService(params.id);
        return NextResponse.json(task, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}

export async function assignUserToTaskController(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { assigneeId } = await req.json();
        const result = await taskService.assignUserToTaskService(userId, params.id, assigneeId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
