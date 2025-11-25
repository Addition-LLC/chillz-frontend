"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import medusaClient from "@/lib/medusa";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PK || ""
);

interface StripePaymentProps {
  clientSecret: string;
}

export default function StripePayment({ clientSecret }: StripePaymentProps) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PK) {
    return <div className="text-red-500 font-semibold">Stripe Publishable Key is missing in .env.local</div>;
  }
  if (!clientSecret) {
     return <div className="text-center py-4 text-gray-600">Initializing payment...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeForm clientSecret={clientSecret} />
    </Elements>
  );
}

const StripeForm = ({ clientSecret }: { clientSecret: string }) => {
  const { cart, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const cardElement = elements?.getElement(CardElement);

    if (!stripe || !elements || !cardElement || !cart?.id) {
       setError("Payment system is not ready. Please try again in a moment.");
       return;
    }

    setLoading(true);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${cart.shipping_address?.first_name || ''} ${cart.shipping_address?.last_name || ''}`,
          email: cart.email,
          phone: cart.shipping_address?.phone,
          address: {
            city: cart.shipping_address?.city,
            country: cart.shipping_address?.country_code,
            line1: cart.shipping_address?.address_1,
            line2: cart.shipping_address?.address_2,
            postal_code: cart.shipping_address?.postal_code,
            state: cart.shipping_address?.province,
          },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || "An error occurred during payment confirmation.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
       setError("Payment processing failed. Please try again.");
       setLoading(false);
       return;
    }

    try {
      const response = await medusaClient.store.cart.complete(cart.id);

      if (response.type === "cart" && response.cart) {
        console.error("Cart completion failed after payment:", response.error);
        setError("Payment succeeded but failed to create the order. Please contact support.");
        setLoading(false);
      } else if (response.type === "order" && response.order) {
        console.log("Order placed successfully:", response.order);
        refreshCart();
        router.push(`/order/confirmed/${response.order.id}`);
      } else {
         console.error("Unexpected response structure:", response);
         setError("An unexpected error occurred after payment processing. Please contact support.");
         setLoading(false);
      }
    } catch (completionError: any) {
        console.error("Failed to complete cart:", completionError);
        setError("Payment succeeded but failed to finalize the order. Please contact support.");
        setLoading(false);
    }
  };

  const cardElementOptions = {
      style: {
          base: {
              fontSize: '16px',
              color: '#000000',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '400',
              '::placeholder': {
                  color: '#9CA3AF',
                  fontWeight: '400',
              },
              iconColor: '#000000',
          },
          invalid: {
              color: '#EF4444',
              iconColor: '#EF4444',
          },
          complete: {
              color: '#000000',
              iconColor: '#10B981',
          },
      },
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
       <div className="space-y-4">
         <h3 className="text-xl font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Payment Information</h3>
         <p className="text-sm text-gray-600">Complete your purchase securely with Stripe</p>
       </div>

       <div className="bg-white border-2 border-black p-6 space-y-5">
         <div className="space-y-2">
           <label className="block text-sm font-semibold text-black">Card Information</label>
           <div className="relative">
             <div className="p-4 border-2 border-gray-300 focus-within:border-black transition-colors bg-white">
               <CardElement options={cardElementOptions} />
             </div>
           </div>
           <p className="text-xs text-gray-500 mt-1">Enter your card number, expiry date, and CVC</p>
         </div>

         <div className="flex items-center justify-between pt-3 border-t border-gray-200">
           <div className="flex items-center gap-2 text-xs text-gray-600">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
             <span>Secured by Stripe</span>
           </div>
           <div className="flex items-center gap-2">
             <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
               <rect width="32" height="20" rx="2" fill="#EB001B"/>
               <circle cx="12" cy="10" r="7" fill="#F79E1B" fillOpacity="0.8"/>
               <circle cx="20" cy="10" r="7" fill="#FF5F00" fillOpacity="0.8"/>
             </svg>
             <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
               <rect width="32" height="20" rx="2" fill="#0066B2"/>
               <path d="M13 6h6v8h-6z" fill="#FFCC00"/>
             </svg>
           </div>
         </div>
       </div>

       {error && (
         <div className="p-4 bg-red-50 border-2 border-red-200">
           <p className="text-red-700 text-sm font-medium">{error}</p>
         </div>
       )}

       <button
         type="submit"
         disabled={loading || !stripe || !elements}
         className="w-full bg-black text-white font-bold py-4 px-6 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
         style={{ fontFamily: 'var(--font-caviar-dreams)' }}
       >
         {loading ? (
           <>
             <LoadingSpinner size="md" color="white" />
             <span>Processing Payment...</span>
           </>
         ) : (
           <>
             <span>Place Order</span>
             <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
             </svg>
           </>
         )}
       </button>

       <p className="text-xs text-center text-gray-500">
         Your payment information is encrypted and secure. We never store your card details.
       </p>
     </form>
  );
};