"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/CartContext"; // Use your CartContext path
import { useState } from "react";
import medusaClient from "@/lib/medusa"; // Use your Medusa client path
import { useRouter } from "next/navigation"; // For redirection
// import type { HttpTypes } from "@medusajs/types"; // Import HttpTypes

// Load Stripe outside of the component to avoid recreating it on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PK || "" // Use your env variable
);

interface StripePaymentProps {
  // We need the client secret from the Medusa payment session
  clientSecret: string;
}

// Main component wrapped in Elements provider
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

// Inner form component that uses Stripe hooks
const StripeForm = ({ clientSecret }: { clientSecret: string }) => {
  const { cart, refreshCart } = useCart(); // Get refreshCart from context
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

    // 1. Confirm the card payment with Stripe's API
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

    // 2. Complete the cart in Medusa to create the order
    try {
      // FIX: Destructure the response correctly. There is no 'data' property.
      const response = await medusaClient.store.cart.complete(cart.id);

      if (response.type === "cart" && response.cart) {
        // Error occurred during completion
        console.error("Cart completion failed after payment:", response.error);
        setError("Payment succeeded but failed to create the order. Please contact support.");
        setLoading(false);
      } else if (response.type === "order" && response.order) {
        // Payment succeeded & order created!
        console.log("Order placed successfully:", response.order);
        refreshCart(); // Use the context's refreshCart function
        // Redirect to an order confirmation page
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

  // Basic styling for CardElement
  const cardElementOptions = {
      style: {
          base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              '::placeholder': {
                  color: '#aab7c4',
              },
          },
          invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
          },
      },
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
       <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
       <div className="p-3 border border-gray-300 rounded-md bg-white shadow-sm">
         <CardElement options={cardElementOptions} />
       </div>

       {error && <p className="text-red-600 text-sm">{error}</p>}

       <button
         type="submit"
         disabled={loading || !stripe || !elements}
         className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
       >
         {loading ? "Processing Payment..." : "Place Order"}
       </button>
     </form>
  );
};