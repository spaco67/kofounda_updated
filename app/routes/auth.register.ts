import { json } from '@remix-run/node';
import { connectDB } from '~/lib/db.server';
import { User } from '~/models/User';
import { ChatHistory } from '~/models/ChatHistory';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    await connectDB();

    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate input
    if (!fullName || !email || !password) {
      return json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password,
    });

    await user.save();

    // Create empty chat history for new user
    await ChatHistory.create({
      userId: user._id,
      messages: []
    });

    return json(
      { message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 