import { NextResponse } from "next/server";
import * as userService from "../services/userService";
import { loginSchema, registerSchema } from "./schemas";

export async function registerUserController(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const user = await userService.registerUser(parsed.data);
        return NextResponse.json({ message: "Usuário registrado com sucesso!", user }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function loginUserController(req: Request) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const result = await userService.loginUser(parsed.data.email, parsed.data.password);
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 401 });
    }
}

export async function getCurrentUserController(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
        }
        const user = await userService.getUserById(userId);
        return NextResponse.json(user, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}

export async function getUserByIdController(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await userService.getUserById(params.id);
        return NextResponse.json(user, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}

export async function updateUserController(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        // schema simples: permite name e password strings
        const parsed = (await import("zod")).z
            .object({ name: (await import("zod")).z.string().min(1).optional(), password: (await import("zod")).z.string().min(6).optional() })
            .safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
        }
        const user = await userService.updateUser(params.id, parsed.data);
        return NextResponse.json(user, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function deleteUserController(req: Request, { params }: { params: { id: string } }) {
    try {
        await userService.deleteUser(params.id);
        return NextResponse.json({ message: "Usuário deletado com sucesso." }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}