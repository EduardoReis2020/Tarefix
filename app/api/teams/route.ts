import { NextRequest } from "next/server";
import * as teamController from "../controllers/teamController";

export async function GET(req: NextRequest) {
    return teamController.getTeamByIdController(req as unknown as Request, { params: { id: req.headers.get('x-user-id') || '' } });
}

export async function POST(req: NextRequest) {
    return teamController.createTeamController(req as unknown as Request);
}