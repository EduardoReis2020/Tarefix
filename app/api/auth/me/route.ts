import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

export { prisma };

import { NextRequest } from "next/server";
import * as authController from "../../controllers/authController";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) return new Response(JSON.stringify({ error: "Usuário não autenticado." }), { status: 401 });
    return authController.getAuthenticatedUser(userId);
}
