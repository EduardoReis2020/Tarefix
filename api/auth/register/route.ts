import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validar dados de entrada
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" }, 
                { status: 400 }
            );
        }

        // Verificar se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Usuário já existe" }, 
                { status: 409 }
            );
        }

        // Gerar hash da senha e criar novo usuário
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return NextResponse.json(
            { message: "Usuário registrado com sucesso!", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" }, 
            { status: 500 }
        );
    }
}
