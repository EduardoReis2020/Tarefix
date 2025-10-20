import { NextResponse } from "next/server";
import * as taskService from "../services/taskService";
import { assignTaskSchema, createTaskSchema, updateTaskSchema } from "./schemas";

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

        const body = await req.json();
        const parsed = createTaskSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const task = await taskService.createTaskService(userId, parsed.data);
        return NextResponse.json(task, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function updateTaskController(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const body = await req.json();
        const parsed = updateTaskSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const task = await taskService.updateTaskService(userId, params.id, parsed.data);
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

        const body = await req.json();
        const parsed = assignTaskSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const result = await taskService.assignUserToTaskService(userId, params.id, parsed.data.assigneeId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
