import { NextRequest } from "next/server";
import { getTaskByIdController, updateTaskController, deleteTaskController } from "../../controllers/taskController";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await (context.params as Promise<{ id: string }>);
    return getTaskByIdController(req as unknown as Request, { params });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await (context.params as Promise<{ id: string }>);
    return updateTaskController(req as unknown as Request, { params });
}

// Compat: aceitar PUT além de PATCH
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await (context.params as Promise<{ id: string }>);
    return updateTaskController(req as unknown as Request, { params });
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await (context.params as Promise<{ id: string }>);
    return deleteTaskController(req as unknown as Request, { params });
}
