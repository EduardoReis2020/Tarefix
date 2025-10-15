import { NextRequest } from "next/server";
import { addMemberController, removeMemberController } from "../../../controllers/membershipController";

export async function POST(req: NextRequest) {
    // teamId vem no body do request; não é necessário extrair params aqui
    return addMemberController(req as unknown as Request);
}

export async function DELETE(req: NextRequest) {
    return removeMemberController(req as unknown as Request);
}
