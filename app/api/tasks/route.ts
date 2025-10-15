import { NextRequest } from "next/server";
import { getTasksController, createTaskController } from "../controllers/taskController";

export async function GET(req: NextRequest) {
    return getTasksController(req as unknown as Request);
}

export async function POST(req: NextRequest) {
    return createTaskController(req as unknown as Request);
}
