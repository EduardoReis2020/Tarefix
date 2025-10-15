import {
    findMembershipByUserAndTeam,
    createMembership,
    listMembershipsByTeam,
    findMembershipById,
    updateMembershipRole,
    deleteMembership,
} from "../repositories/membershipRepository";
import { TeamRole } from "@prisma/client";

export async function addMemberToTeam({
    requesterId,
    teamId,
    userId,
    role = TeamRole.MEMBER,
    }: {
    requesterId: string;
    teamId: string;
    userId: string;
    role?: TeamRole;
    }) {
    // Verifica se quem está adicionando tem permissão
    const requesterMembership = await findMembershipByUserAndTeam(requesterId, teamId);
    if (!requesterMembership || requesterMembership.role !== TeamRole.ADMIN) {
        throw new Error("Apenas ADMIN podem adicionar membros.");
    }

    // Verifica se já existe membership para esse user no time
    const existing = await findMembershipByUserAndTeam(userId, teamId);
    if (existing) {
        throw new Error("Este usuário já faz parte do time.");
    }

    return createMembership({ userId, teamId, role });
}

export async function changeMemberRole({
    requesterId,
    membershipId,
    newRole,
    }: {
    requesterId: string;
    membershipId: string;
    newRole: TeamRole;
    }) {
    const membership = await findMembershipById(membershipId);
    if (!membership) throw new Error("Membro não encontrado.");

    const requesterMembership = await findMembershipByUserAndTeam(requesterId, membership.teamId);
    if (!requesterMembership || requesterMembership.role !== TeamRole.ADMIN) {
        throw new Error("Apenas o ADMIN pode alterar o cargo de outros membros.");
    }

    return updateMembershipRole(membershipId, newRole);
}

export async function removeMemberFromTeam({
    requesterId,
    membershipId,
    }: {
        requesterId: string;
        membershipId: string;
    }) {
    const membership = await findMembershipById(membershipId);
    if (!membership) throw new Error("Membro não encontrado.");

    const requesterMembership = await findMembershipByUserAndTeam(requesterId, membership.teamId);
    if (!requesterMembership || requesterMembership.role !== TeamRole.ADMIN) {
        throw new Error("Apenas ADMIN podem remover membros.");
    }

    if (membership.role === TeamRole.ADMIN) {
        throw new Error("Não é possível remover o ADMIN.");
    }

    return deleteMembership(membershipId);
}

export async function listTeamMembers(teamId: string) {
    return listMembershipsByTeam(teamId);
}
