import prisma from "../../../lib/prisma";

export async function findWorkspaceMembershipByUser(userId: string) {
    return prisma.workspaceMembership.findFirst({
        where: { userId },
        include: { workspace: true },
    });
}

export async function createWorkspace(data: { name: string; description?: string; ownerId: string }) {
    // cria workspace e a membership OWNER em transação
    return prisma.$transaction(async (tx) => {
        const workspace = await tx.workspace.create({
        data: {
            name: data.name,
            description: data.description,
        },
        });
        await tx.workspaceMembership.create({
        data: {
            userId: data.ownerId,
            workspaceId: workspace.id,
            role: "OWNER",
        },
        });
        return workspace;
    });
}