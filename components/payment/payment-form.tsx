'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

function PaymentFormContent({ amount, orderId, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'bank'>('card');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else {
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'card' 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'wallet' 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs">Wallet</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'bank' 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Bank</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod === 'card' && (
            <div className="p-4 border rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center py-4 border-t">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-sky-600">
              ${amount.toFixed(2)}
            </span>
          </div>

          <Button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-sky-500 hover:bg-sky-600"
            size="lg"
          >
            {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>

        <div className="text-xs text-gray-500 text-center">
          Your payment information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}