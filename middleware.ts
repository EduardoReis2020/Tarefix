import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  // Permite preflight CORS e HEAD sem autenticação nas rotas protegidas
  if (request.method === 'OPTIONS' || request.method === 'HEAD') {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
  }

  // Anexa o id do usuário ao header para as rotas API (ex: /api/auth/me)
  const userId = typeof payload.userId === 'string' ? payload.userId : String(payload.userId ?? '');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', String(userId));

  // Importante: injetar no request, não apenas no response, para que os handlers consigam ler
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/api/auth/me', '/api/:path*/private', '/api/tasks/:path*', '/api/teams/:path*', '/api/workspace'],
};
