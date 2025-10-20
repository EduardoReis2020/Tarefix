import * as repo from "../repositories/workspaceRepository";
import * as userRepo from "../repositories/userRepository";

export async function ensureWorkspaceForUser(userId: string) {
  const membership = await repo.findWorkspaceMembershipByUser(userId);
  if (membership && membership.workspace) return membership.workspace;

  // Se não existe, criar workspace padrão para o user
  const user = await userRepo.findUserById(userId);
  const defaultName = `Workspace de ${user?.name ?? userId}`;
  const ws = await repo.createWorkspace({ name: defaultName, ownerId: userId });
  return ws;
}