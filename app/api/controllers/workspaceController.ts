import { NextRequest } from "next/server";
import * as workspaceService from "../services/workspaceService";

export async function POST(req: NextRequest) {
  // o middleware já pode injetar x-user-id; preferir isso:
  const userId = req.headers.get("x-user-id");
  if (!userId) return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401 });

  try {
    const ws = await workspaceService.ensureWorkspaceForUser(userId);
    return new Response(JSON.stringify(ws), { status: 200, headers: { "content-type": "application/json" } });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "content-type": "application/json" } });
  }
}