// prisma centralizado em lib/prisma (não utilizado diretamente nesta rota)

import { NextRequest } from "next/server";
import * as authController from "../../controllers/authController";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) return new Response(JSON.stringify({ error: "Usuário não autenticado." }), { status: 401 });
    return authController.getAuthenticatedUser(userId);
}
