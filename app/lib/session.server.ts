import { createCookieSessionStorage, redirect } from '@remix-run/node';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'kofounda_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function getSession(cookieHeader: string | null) {
  return sessionStorage.getSession(cookieHeader);
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export async function destroySession(session: any) {
  return sessionStorage.destroySession(session);
}

export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
} 