import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'Farhanrangrej8055@gmail.com';
const ADMIN_PASS = 'Farhan@8055';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'kaianime_admin_secret_key_8055_secure_sign';
export const COOKIE_NAME = 'kaianime_admin_token';

export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    pass.trim() === ADMIN_PASS
  );
}

export function createAdminSessionToken(): string {
  const payload = JSON.stringify({
    email: ADMIN_EMAIL,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');
  return encodedPayload + "." + signature;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSig) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return false;
    return payload.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}
