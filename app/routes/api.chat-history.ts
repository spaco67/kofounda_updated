import { json } from '@remix-run/node';
import { connectDB } from '~/lib/db.server';
import { ChatHistory } from '~/models/ChatHistory';
import { getUserId } from '~/lib/session.server';

// Get chat history for the current user
export async function loader({ request }: { request: Request }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return json({ messages: [] });
    }

    await connectDB();
    const chatHistory = await ChatHistory.findOne({ userId });
    return json({ messages: chatHistory?.messages || [] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return json({ messages: [] });
  }
}

// Save new messages to chat history
export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const userId = await getUserId(request);
    if (!userId) {
      return json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await request.json();

    await connectDB();
    
    // Find or create chat history for user
    let chatHistory = await ChatHistory.findOne({ userId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId,
        messages: []
      });
    }

    // Add new messages
    chatHistory.messages.push(...messages);
    await chatHistory.save();

    return json({ message: 'Chat history updated' });
  } catch (error) {
    console.error('Error saving chat history:', error);
    return json({ message: 'Failed to save chat history' }, { status: 500 });
  }
} 