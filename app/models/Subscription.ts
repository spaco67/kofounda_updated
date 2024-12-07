import mongoose from 'mongoose';

export enum SubscriptionTier {
  BASIC = 'BASIC',      // 10,000 NGN
  STANDARD = 'STANDARD', // 30,000 NGN
  PREMIUM = 'PREMIUM'    // 50,000 NGN
}

export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export const SUBSCRIPTION_PRICES = {
  [SubscriptionTier.BASIC]: 10000,
  [SubscriptionTier.STANDARD]: 30000,
  [SubscriptionTier.PREMIUM]: 50000,
};

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tier: {
    type: String,
    enum: Object.values(SubscriptionTier),
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.PENDING
  },
  paymentReference: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

// Update the updatedAt timestamp before saving
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema); 