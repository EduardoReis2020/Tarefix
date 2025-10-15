import { NextResponse } from "next/server";
import * as membershipService from "../services/membershipService";

export async function addMemberController(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const body = await req.json();
        const { teamId, userId: newUserId, role } = body;

        const membership = await membershipService.addMemberToTeam({
            requesterId: userId,
            teamId,
            userId: newUserId,
            role,
        });

        return NextResponse.json(membership, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function changeMemberRoleController(req: Request) {
    try {
        const requesterId = req.headers.get("x-user-id");
        if (!requesterId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const body = await req.json();
        const { membershipId, newRole } = body;

        const result = await membershipService.changeMemberRole({
            requesterId,
            membershipId,
            newRole,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function removeMemberController(req: Request) {
    try {
        const requesterId = req.headers.get("x-user-id");
        if (!requesterId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const body = await req.json();
        const { membershipId } = body;

        await membershipService.removeMemberFromTeam({ requesterId, membershipId });
        return NextResponse.json({ message: "Membro removido com sucesso" }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function listMembersController(req: Request, { params }: { params: { teamId: string } }) {
    try {
        const teamId = params.teamId;
        const members = await membershipService.listTeamMembers(teamId);
        return NextResponse.json(members, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
