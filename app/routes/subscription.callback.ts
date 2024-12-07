import { json, redirect } from '@remix-run/node';
import { connectDB } from '~/lib/db.server';
import { Subscription } from '~/models/Subscription';
import { verifyPayment } from '~/lib/paystack.server';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference');

  if (!reference) {
    return redirect('/subscription?error=missing_reference');
  }

  try {
    await connectDB();
    const subscription = await Subscription.findOne({ paymentReference: reference });
    
    if (!subscription) {
      return redirect('/subscription?error=invalid_reference');
    }

    // Verify payment with Paystack
    const verification = await verifyPayment(reference);
    
    if (verification.data.status === 'success') {
      subscription.status = 'active';
      await subscription.save();
      return redirect('/subscription?success=true');
    } else {
      subscription.status = 'failed';
      await subscription.save();
      return redirect('/subscription?error=payment_failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return redirect('/subscription?error=verification_failed');
  }
} 