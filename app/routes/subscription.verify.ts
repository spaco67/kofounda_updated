import { redirect } from '@remix-run/node';
import { connectDB } from '~/lib/db.server';
import { Subscription, SubscriptionStatus } from '~/models/Subscription';
import { verifyPayment } from '~/lib/paystack.server';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference');

  if (!reference) {
    return redirect('/profile?error=missing_reference');
  }

  try {
    await connectDB();
    const subscription = await Subscription.findOne({ paymentReference: reference });
    
    if (!subscription) {
      return redirect('/profile?error=invalid_reference');
    }

    // Verify payment with Paystack
    const verification = await verifyPayment(reference);
    
    if (verification.data.status === 'success') {
      subscription.status = SubscriptionStatus.ACTIVE;
      await subscription.save();
      return redirect('/profile?success=subscription_active');
    } else {
      subscription.status = SubscriptionStatus.FAILED;
      await subscription.save();
      return redirect('/profile?error=payment_failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return redirect('/profile?error=verification_failed');
  }
} 