import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;

    // Definir rotas públicas (não precisam de token)
    const publicRoutes = ["/api/auth/login", "/api/auth/register"];
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Pegar token do header Authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Token não fornecido." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        // Anexa o userId/email no request (pra usar depois em handlers)
        request.headers.set("x-user-id", decoded.id);
        request.headers.set("x-user-email", decoded.email);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json(
            { error: "Token inválido ou expirado." }, 
            { status: 401 }
        );
    }
}

// Aplica o middleware apenas em rotas da API
export const config = {
    matcher: ["/api/:path*"],
};
