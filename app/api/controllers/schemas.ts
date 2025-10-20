import { z } from "zod";
import { TeamRole } from "@prisma/client";

export const registerSchema = z.object({
  name: z.string().min(1, "nome é obrigatório"),
  email: z.string().email("email inválido"),
  password: z.string().min(6, "senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("email inválido"),
  password: z.string().min(1, "senha é obrigatória"),
});

export const createTeamSchema = z.object({
  ownerId: z.string().min(1, "ownerId é obrigatório"), // pode vir 'self'
  workspaceId: z.string().optional(),
  name: z.string().min(1, "nome do time é obrigatório"),
  description: z.string().optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "título é obrigatório"),
  description: z.string().optional(),
  teamId: z.string().min(1, "teamId é obrigatório"),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "LATE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
});

export const assignTaskSchema = z.object({
  assigneeId: z.string().min(1, "assigneeId é obrigatório"),
});

export const membershipAddSchema = z.object({
  teamId: z.string().min(1),
  userId: z.string().min(1),
  role: z.nativeEnum(TeamRole).optional(),
});

export const membershipChangeRoleSchema = z.object({
  membershipId: z.string().min(1),
  newRole: z.nativeEnum(TeamRole),
});

export const membershipRemoveSchema = z.object({
  membershipId: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type MembershipAddInput = z.infer<typeof membershipAddSchema>;
export type MembershipChangeRoleInput = z.infer<typeof membershipChangeRoleSchema>;
export type MembershipRemoveInput = z.infer<typeof membershipRemoveSchema>;
