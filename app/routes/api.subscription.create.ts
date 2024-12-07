import { json } from '@remix-run/node';
import { getUserId } from '~/lib/session.server';
import { connectDB } from '~/lib/db.server';
import { User } from '~/models/User';
import { 
  Subscription, 
  SUBSCRIPTION_PRICES, 
  SubscriptionTier,
  SubscriptionStatus 
} from '~/models/Subscription';
import { initializePayment } from '~/lib/paystack.server';
import { nanoid } from 'nanoid';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const userId = await getUserId(request);
    if (!userId) {
      return json({ message: 'Please login to subscribe' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return json({ message: 'User not found' }, { status: 404 });
    }

    const { tier } = await request.json();
    if (!Object.values(SubscriptionTier).includes(tier)) {
      return json({ message: 'Invalid subscription tier' }, { status: 400 });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      status: SubscriptionStatus.ACTIVE,
    });

    if (existingSubscription) {
      return json({ message: 'You already have an active subscription' }, { status: 400 });
    }

    // Generate unique reference
    const reference = `sub_${nanoid()}`;
    
    // Initialize payment with Paystack (amount in kobo)
    const amount = SUBSCRIPTION_PRICES[tier as SubscriptionTier] * 100;
    const paymentData = await initializePayment({
      email: user.email,
      amount,
      reference,
      callbackUrl: `${process.env.APP_URL}/subscription/verify?reference=${reference}`,
      metadata: {
        userId,
        tier,
      }
    });

    // Create pending subscription
    const subscription = new Subscription({
      userId,
      tier,
      amount: SUBSCRIPTION_PRICES[tier as SubscriptionTier],
      paymentReference: reference,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: SubscriptionStatus.PENDING
    });

    await subscription.save();

    return json({
      success: true,
      authorizationUrl: paymentData.data.authorization_url,
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return json(
      { message: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 