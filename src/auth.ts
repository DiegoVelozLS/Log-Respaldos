'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload, User } from '@/lib/definitions';
import { getUserByEmail } from '@/lib/data';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-development';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string | undefined = ''): Promise<any> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

export async function signIn(email: string) {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Exclude password from the user object that goes into the session
    const { password, ...userWithoutPassword } = user;
    const sessionPayload: SessionPayload = { user: userWithoutPassword, expires: expires.toISOString() };
    
    const session = await encrypt(sessionPayload);

    cookies().set('session', session, { expires, httpOnly: true });
}

export async function signOut() {
    cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession(): Promise<SessionPayload | null> {
    const sessionCookie = cookies().get('session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session?.user) {
        return null;
    }
    
    return session as SessionPayload;
}
