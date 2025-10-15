import { NextRequest } from "next/server";
import * as authController from "../../controllers/authController";

export async function POST(req: NextRequest) {
	// acessar header apenas para evitar warning
	void req.headers.get('authorization');
	return authController.logoutUser();
}

