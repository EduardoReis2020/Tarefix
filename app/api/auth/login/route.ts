import { NextRequest } from "next/server";
import * as authController from "../../controllers/authController";

export async function POST(req: NextRequest) {
    const body = await req.json();
    // body tem { email, password }
    return authController.loginUser(body as { email: string; password: string });
}
