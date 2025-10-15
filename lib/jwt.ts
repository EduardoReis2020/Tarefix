import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta';
const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

export async function signToken(payload: Record<string, unknown>, expiresInSeconds = 60 * 60 * 24) {
  // expiresInSeconds: number of seconds until expiration (default 1 day)
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}
