import { NextRequest } from "next/server";
import * as teamController from "../controllers/teamController";

export async function GET(req: NextRequest) {
    return teamController.listTeamsForUserController(req as unknown as Request);
}

export async function POST(req: NextRequest) {
    return teamController.createTeamController(req as unknown as Request);
}