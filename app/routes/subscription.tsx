import { useSearchParams } from '@remix-run/react';
import { SubscriptionPlans } from '~/components/subscription/SubscriptionPlans';

export default function SubscriptionPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-bolt-elements-background-depth-0">
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg max-w-2xl mx-auto mt-4">
          Subscription successful! Thank you for subscribing.
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg max-w-2xl mx-auto mt-4">
          {error === 'payment_failed' && 'Payment failed. Please try again.'}
          {error === 'verification_failed' && 'Could not verify payment. Please contact support.'}
          {error === 'missing_reference' && 'Invalid payment reference.'}
        </div>
      )}

      <SubscriptionPlans />
    </div>
  );
} 