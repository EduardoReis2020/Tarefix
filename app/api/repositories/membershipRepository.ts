import { TeamRole } from "@prisma/client";
import prisma from "../../../lib/prisma";

// Busca um membership pelo userId e teamId
export async function findMembershipByUserAndTeam(userId: string, teamId: string) {
    return prisma.membership.findFirst({
        where: {
            userId,
            teamId,
        },
    });
}
//Cria um novo membership (associação entre usuário e time)
export async function createMembership(data: { userId: string; teamId: string; role: TeamRole }) {
    return prisma.membership.create({
        data,
    });
}
// Lista todos os memberships de um time
export async function listMembershipsByTeam(teamId: string) {
    return prisma.membership.findMany({
        where: { teamId },
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            role: true,
        },
    });
}


// Busca um membership por ID
export async function findMembershipById(id: string) {
    return prisma.membership.findUnique({ where: { id } });
}


// Atualiza o cargo de um membro (role)
export async function updateMembershipRole(id: string, role: TeamRole) {
    return prisma.membership.update({
        where: { id },
        data: { role },
    });
}


// Remove um membership (expulsar membro)
export async function deleteMembership(id: string) {
    return prisma.membership.delete({
        where: { id },
    });
}