import { NextRequest } from "next/server";
import * as authController from "../../controllers/authController";

export async function POST(req: NextRequest) {
    const body = await req.json();
    return authController.registerUser(body as { name: string; email: string; password: string });
}
