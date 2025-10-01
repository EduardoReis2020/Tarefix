import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// chave secreta (ideal usar process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validar dados de entrada
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email e senha são obrigatórios" }, 
                { status: 400 }
            );
        }

        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" }, 
                { status: 401 }
            );
        }

        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Senha incorreta" }, 
                { status: 401 }
            );
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: "1d" }
        );

        return NextResponse.json(
            { message: "Login bem-sucedido", token },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" }, 
            { status: 500 }
        );
    }
}
