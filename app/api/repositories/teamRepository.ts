import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cria um time
export async function createTeam(data: { name: string; description?: string; ownerId: string }) {
    // cast local para evitar divergências de tipos gerados pelo prisma client
    const payload = {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        memberships: {
        create: {
            userId: data.ownerId,
            role: "ADMIN",
        },
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- short-term workaround until Prisma client types are aligned
    return prisma.team.create({ data: payload as any });
}

// Busca time por ID
export async function findTeamById(teamId: string) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return null;
    const memberships = await prisma.membership.findMany({ where: { teamId }, include: { user: true } });
    return { ...team, memberships };
}

// Busca todos os times de um usuário
export async function findTeamsByUser(userId: string) {
    return prisma.team.findMany({
        where: {
        memberships: {
            some: { userId },
        },
        },
        include: {
        memberships: true,
        },
    });
}

// Atualiza time
export async function updateTeam(teamId: string, data: Partial<{ name: string; description: string }>) {
    return prisma.team.update({
        where: { id: teamId },
        data,
    });
}

// Deleta time
export async function deleteTeam(teamId: string) {
    return prisma.team.delete({ where: { id: teamId } });
}

// Adiciona membro ao time
export async function addMemberToTeam(teamId: string, userId: string, role: "MEMBER" | "READONLY") {
    return prisma.membership.create({
        data: {
        teamId,
        userId,
        role,
        },
    });
}

// Remove membro do time
export async function removeMemberFromTeam(teamId: string, userId: string) {
    // Não usar where unique gerado; remover via deleteMany para evitar mismatch de nomes
    return prisma.membership.deleteMany({ where: { teamId, userId } });
}

// Atualiza cargo de membro
export async function updateMemberRole(teamId: string, userId: string, role: "ADMIN" | "MEMBER" | "READONLY") {
    const membership = await prisma.membership.findFirst({ where: { teamId, userId } });
    if (!membership) throw new Error("Membership não encontrado");
    return prisma.membership.update({ where: { id: membership.id }, data: { role } });
}

// Busca associação de usuário com time
export async function findMembershipByUserAndTeam(userId: string, teamId: string) {
    return prisma.membership.findFirst({ where: { userId, teamId } });
}
