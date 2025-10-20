import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "../../../lib/jwt";


export async function registerUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        return NextResponse.json(
            { error: "Todos os campos são obrigatórios" },
            { status: 400 }
        );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json(
            { error: "Usuário já existe" },
            { status: 409 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true },
    });

    return NextResponse.json(
        { message: "Usuário registrado com sucesso!", user: newUser },
        { status: 201 }
    );
}

export async function loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email e senha são obrigatórios" },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json(
            { error: "Usuário não encontrado" },
            { status: 401 }
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Senha incorreta" },
            { status: 401 }
        );
    }

    const token = await signToken({ userId: user.id, email: user.email }, 86400); // 1 dia em segundos
    return NextResponse.json(
        { message: "Login bem-sucedido", token }, 
        { status: 200 }
    );
}

export async function getAuthenticatedUser(userId: string) {
    if (!userId) {
        return NextResponse.json(
            { error: "Usuário não autenticado." },
            { status: 401 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return NextResponse.json(
            { error: "Usuário não encontrado." },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { user }, 
        { status: 200 }
    );
}

export async function logoutUser() {
    return NextResponse.json(
        { message: "Logout bem-sucedido" }, 
        { status: 200 }
    );
}