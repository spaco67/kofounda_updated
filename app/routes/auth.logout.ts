import { redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/lib/session.server';

export async function action({ request }: { request: Request }) {
  const session = await getSession(request.headers.get('Cookie'));
  
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
} 