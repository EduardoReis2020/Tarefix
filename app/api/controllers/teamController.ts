import { NextResponse } from "next/server";
import * as teamService from "../services/teamService";
import { createTeamSchema, updateTeamSchema } from "./schemas";

export async function listTeamsForUserController(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        const teams = await teamService.listTeamsForUserService(userId);
        return NextResponse.json(teams, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function createTeamController(req: Request) {
    try {
        const body = await req.json();
        const parsed = createTeamSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
    const data = parsed.data;
    const userId = req.headers.get("x-user-id");
    const ownerId = data.ownerId === 'self' ? (userId || data.ownerId) : data.ownerId;
    const team = await teamService.createTeamService(ownerId, data);
        return NextResponse.json({ message: "Equipe criada com sucesso!", team }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function getTeamByIdController(req: Request, { params }: { params: { id: string } }) {
    try {
        const team = await teamService.getTeamDetailsService(params.id, params.id);
        return NextResponse.json(team, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}

export async function updateTeamController(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const parsed = updateTeamSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const data = parsed.data;
        const team = await teamService.updateTeamService(params.id, params.id, data);
        return NextResponse.json(team, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function deleteTeamController(req: Request, { params }: { params: { id: string } }) {
    try {
        await teamService.deleteTeamService(params.id, params.id);
        return NextResponse.json({ message: "Equipe deletada com sucesso." }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}