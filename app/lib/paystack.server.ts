import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY must be set');
}

const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function initializePayment({
  email,
  amount,
  reference,
  callbackUrl
}: {
  email: string;
  amount: number; // in kobo (multiply NGN by 100)
  reference: string;
  callbackUrl: string;
}) {
  try {
    const response = await paystackClient.post('/transaction/initialize', {
      email,
      amount,
      reference,
      callback_url: callbackUrl,
      currency: 'NGN'
    });

    return response.data;
  } catch (error) {
    console.error('Paystack payment initialization error:', error);
    throw error;
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Paystack payment verification error:', error);
    throw error;
  }
} 