import { json, redirect } from '@remix-run/node';
import { connectDB } from '~/lib/db.server';
import { User } from '~/models/User';
import { createUserSession } from '~/lib/session.server';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    await connectDB();
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return createUserSession(user._id.toString(), '/');
  } catch (error) {
    console.error('Login error:', error);
    return json({ message: 'Login failed' }, { status: 500 });
  }
} 