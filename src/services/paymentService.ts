
// Payment service for Stripe integration
// Note: Stripe secret key should be set in environment variables

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string; // Set this when you have Stripe configured
}

export interface PaymentSession {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
}

class PaymentService {
  private stripePublicKey = ''; // Set your Stripe public key here
  private apiEndpoint = '/api/payments'; // Your backend payment endpoint

  async createCheckoutSession(planId: string, userId: string): Promise<PaymentSession> {
    try {
      const response = await fetch(`${this.apiEndpoint}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      return session;
    } catch (error) {
      console.error('Payment session creation error:', error);
      throw error;
    }
  }

  async getPaymentPlans(): Promise<PaymentPlan[]> {
    // Default plans - you can modify these based on your pricing
    return [
      {
        id: 'basic',
        name: 'বেসিক প্ল্যান',
        price: 299,
        currency: 'BDT',
        interval: 'month',
        features: [
          'সীমাহীন নোট ডাউনলোড',
          'AI টিউটর অ্যাক্সেস',
          'কমিউনিটি সাপোর্ট',
          'মোবাইল অ্যাপ'
        ],
        stripePriceId: '' // Set your Stripe price ID
      },
      {
        id: 'premium',
        name: 'প্রিমিয়াম প্ল্যান',
        price: 499,
        currency: 'BDT',
        interval: 'month',
        features: [
          'সব বেসিক ফিচার',
          'লাইভ টিউটরিং',
          'ভিডিও কল সাপোর্ট',
          'প্রাইভেট স্টাডি রুম',
          'অগ্রাধিকার সাপোর্ট'
        ],
        stripePriceId: '' // Set your Stripe price ID
      },
      {
        id: 'yearly',
        name: 'বার্ষিক প্ল্যান',
        price: 2999,
        currency: 'BDT',
        interval: 'year',
        features: [
          'সব প্রিমিয়াম ফিচার',
          '৫০% ছাড়',
          'অফলাইন কনটেন্ট',
          'কাস্টম স্টাডি প্ল্যান'
        ],
        stripePriceId: '' // Set your Stripe price ID
      }
    ];
  }

  async verifyPayment(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/verify/${sessionId}`);
      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  redirectToCheckout(sessionUrl: string): void {
    window.location.href = sessionUrl;
  }
}

export const paymentService = new PaymentService();
