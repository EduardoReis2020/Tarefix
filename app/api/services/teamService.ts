import * as teamRepo from "../repositories/teamRepository";

// Criar um time
export async function createTeamService(ownerId: string, data: { name: string; description?: string; workspaceId: string }) {
    if (!data.name || data.name.trim() === "") {
        throw new Error("O nome do time é obrigatório.");
    }

    return teamRepo.createTeam({
        name: data.name,
        description: data.description,
        ownerId,
        workspaceId: data.workspaceId,
    });
}

// Atualizar informações do time
export async function updateTeamService(userId: string, teamId: string, data: { name?: string; description?: string }) {
    const membership = await teamRepo.findMembershipByUserAndTeam(userId, teamId);
    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Somente administradores podem atualizar o time.");
    }

    return teamRepo.updateTeam(teamId, data);
}

// Deletar time
export async function deleteTeamService(userId: string, teamId: string) {
    const team = await teamRepo.findTeamById(teamId);
    if (!team) throw new Error("Time não encontrado.");

    // team pode ou não expor ownerId dependendo de como foi buscado; fallback para checar memberships
    const t = team as unknown as { ownerId?: string; memberships?: Array<{ userId: string; role: string }>} ;
    const ownerId = t.ownerId ?? (t.memberships?.find((m) => m.role === 'OWNER' || m.role === 'ADMIN')?.userId);
    if (ownerId !== userId) {
        throw new Error("Somente o dono do time pode deletá-lo.");
    }

    return teamRepo.deleteTeam(teamId);
}

// Adicionar membro
export async function addMemberToTeamService(adminId: string, teamId: string, userId: string, role: "MEMBER" | "READONLY") {
    const membership = await teamRepo.findMembershipByUserAndTeam(adminId, teamId);
    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Apenas administradores podem adicionar membros.");
    }

    const alreadyMember = await teamRepo.findMembershipByUserAndTeam(userId, teamId);
    if (alreadyMember) {
        throw new Error("Usuário já é membro do time.");
    }

    return teamRepo.addMemberToTeam(teamId, userId, role);
}

// Remover membro
export async function removeMemberFromTeamService(adminId: string, teamId: string, userId: string) {
    const membership = await teamRepo.findMembershipByUserAndTeam(adminId, teamId);
    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Apenas administradores podem remover membros.");
    }

    if (userId === adminId) {
        throw new Error("Você não pode remover a si mesmo do time.");
    }

    return teamRepo.removeMemberFromTeam(teamId, userId);
}

// Atualizar cargo do membro
export async function updateMemberRoleService(adminId: string, teamId: string, userId: string, role: "ADMIN" | "MEMBER" | "READONLY") {
    const membership = await teamRepo.findMembershipByUserAndTeam(adminId, teamId);
    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Apenas administradores podem atualizar cargos.");
    }

    if (adminId === userId) {
        throw new Error("Você não pode alterar o próprio cargo.");
    }

    return teamRepo.updateMemberRole(teamId, userId, role);
}

// Listar times de um usuário
export async function listTeamsForUserService(userId: string) {
    return teamRepo.findTeamsByUser(userId);
}

// Buscar detalhes de um time
export async function getTeamDetailsService(userId: string, teamId: string) {
    const membership = await teamRepo.findMembershipByUserAndTeam(userId, teamId);
    if (!membership) {
        throw new Error("Usuário não tem acesso a este time.");
    }

    return teamRepo.findTeamById(teamId);
}
