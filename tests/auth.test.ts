import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../lib/jwt';

describe('jwt helper (crypto)', () => {
  it('should sign and verify a token', async () => {
  const token = await signToken({ userId: 'test-user', email: 'a@b.com' }, 86400);
    expect(typeof token).toBe('string');

    const payload = await verifyToken(token);
    expect(payload).not.toBeNull();
    if (payload) {
      expect(payload.userId).toBe('test-user');
      expect(payload.email).toBe('a@b.com');
    }
  });

  it('should return null for invalid token', async () => {
    const payload = await verifyToken('invalid.token.here');
    expect(payload).toBeNull();
  });
});
