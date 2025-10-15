import { NextRequest } from "next/server";
import { getTeamByIdController } from "../../controllers/teamController";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const params = await (context.params as Promise<{ id: string }>);
	return getTeamByIdController(req as unknown as Request, { params });
}

