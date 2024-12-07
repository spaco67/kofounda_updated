import { json } from '@remix-run/node';
import { getUserId } from '~/lib/session.server';
import { User } from '~/models/User';
import { connectDB } from '~/lib/db.server';

export async function loader({ request }: { request: Request }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return json(null);
    }

    await connectDB();
    const user = await User.findById(userId).select('-password');
    return json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return json(null);
  }
} 