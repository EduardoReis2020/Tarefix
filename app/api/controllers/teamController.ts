import { NextResponse } from "next/server";
import * as teamService from "../services/teamService";

export async function createTeamController(req: Request) {
    try {
        const data = await req.json();
        const team = await teamService.createTeamService(data.ownerId, data);
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
        const data = await req.json();
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