"use client";

import { useCart } from "@/context/CartContext";
import medusaClient from "@/lib/medusa";
import type { StoreCartShippingOption, StoreCartLineItem, HttpTypes } from "@medusajs/types";
import { useState, useEffect } from "react";
import StripePayment from "@/components/Checkout/StripePayment"; 

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country_code: string;
  postal_code: string;
  province: string;
  phone?: string; 
}

export default function CheckoutPage() {
  const { cart, setCart } = useCart(); 
  const [shippingOptions, setShippingOptions] = useState<StoreCartShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [isAddressSet, setIsAddressSet] = useState(false);
  const [paymentSessionClientSecret, setPaymentSessionClientSecret] = useState<string | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    country_code: "us",
    postal_code: "",
    province: "",
    phone: "",
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (cart) {
      setEmail(cart.email || "");
      if (cart.shipping_address) {
        setShippingAddress({
          first_name: cart.shipping_address.first_name || "",
          last_name: cart.shipping_address.last_name || "",
          address_1: cart.shipping_address.address_1 || "",
          city: cart.shipping_address.city || "",
          country_code: cart.shipping_address.country_code || "us",
          postal_code: cart.shipping_address.postal_code || "",
          province: cart.shipping_address.province || "",
          phone: cart.shipping_address.phone || "",
        });
      }
      if (cart.shipping_methods?.[0]?.shipping_option_id) {
         setSelectedShipping(cart.shipping_methods[0].shipping_option_id);
         setIsAddressSet(true);
         const stripeSession = cart.payment_collection?.payment_sessions?.find((ps: any) => ps.provider_id === 'pp_stripe_stripe');
         if (stripeSession?.data?.client_secret) {
            setPaymentSessionClientSecret(stripeSession.data.client_secret as string);
         }
      }
    }
  }, [cart]);


  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cart?.id) {
        setError("Cart is not available. Please refresh.");
        return;
    }
    setPaymentSessionClientSecret(null);
    setSelectedShipping("");
    setShippingOptions([]);
    setIsAddressSet(false);
    setIsLoadingShipping(true);

    try {
        await medusaClient.store.cart.update(cart.id as string, {
            email: email,
            shipping_address: shippingAddress,
        });

        const { shipping_options } = await medusaClient.store.fulfillment.listCartOptions({
            cart_id: cart.id
        });

        if (shipping_options && shipping_options.length > 0) {
            setShippingOptions(shipping_options);
            setIsAddressSet(true);
        } else {
            setError("No shipping options available for this address.");
            setIsAddressSet(true);
        }
    } catch (err: any) {
      console.error("Failed in handleAddressSubmit:", err);
      setError(err.message || "Failed to save address or fetch shipping options.");
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const createPaymentSessions = async (cartId: string) => {
     setError(null);
     setIsInitializingPayment(true);
     try {
       const { cart: currentCart } = await medusaClient.store.cart.retrieve(cartId, {
           fields: "*payment_collection.payment_providers"
       });
       if (!currentCart) throw new Error("Cart not found before initiating payment.");

       const paymentProviderId = currentCart.payment_collection?.payment_providers?.[0]?.id || 'pp_stripe_stripe';
       if (!paymentProviderId) {
           throw new Error("No payment providers configured for the cart's region.");
       }

       const { payment_collection } = await medusaClient.store.payment.initiatePaymentSession(
         currentCart,
         {
           provider_id: paymentProviderId,
           data: {}
         }
       );

       // FIX 2: Change 'expand' to 'fields' and add '*'
       const { cart: updatedCartWithSession } = await medusaClient.store.cart.retrieve(cartId, {
           fields: "*payment_collection.payment_sessions"
       });
       setCart(updatedCartWithSession);

       const stripeSession = updatedCartWithSession.payment_collection?.payment_sessions?.find((ps: any) => ps.provider_id === 'pp_stripe_stripe');
       if (stripeSession?.data?.client_secret) {
           setPaymentSessionClientSecret(stripeSession.data.client_secret as string);
       } else {
           console.error("Stripe payment session or client_secret not found:", updatedCartWithSession);
           setError("Could not initialize Stripe payment (client secret missing).");
       }
     } catch (err: any) {
         console.error("Failed to create/initiate payment sessions:", err);
         setError(`Failed to initialize payment: ${err.message}`);
     } finally {
        setIsInitializingPayment(false);
     }
  };

  // Handler for selecting a shipping option
  const handleShippingSelect = async (optionId: string) => {
    setSelectedShipping(optionId);
    if (!cart?.id) return;

    setPaymentSessionClientSecret(null);
    setError(null);
    setIsInitializingPayment(true);

    try {
      const { cart: updatedCart } = await medusaClient.store.cart.addShippingMethod(cart.id as string, {
        option_id: optionId,
      });
      setCart(updatedCart); 

      await createPaymentSessions(updatedCart.id);

    } catch (err: any) {
      console.error("Failed to add shipping method or create payment session", err);
      setError("Failed to set shipping method or initialize payment.");
      setIsInitializingPayment(false);
    }
  };

  // Helper to format prices correctly
  const formatPrice = (amount: number | string | undefined | null, currencyCode: string | undefined): string => {
     if (amount === undefined || amount === null || !currencyCode) return 'N/A';
    try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(Number(amount));
    } catch (error) {
        console.error("Error formatting price:", error);
        return 'Invalid Price';
    }
  };

  // Show loading state if cart isn't ready
  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32 text-center text-gray-500">
        Loading cart details...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>Checkout</h1>
       {error && (
         <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto" role="alert">
           <strong className="font-bold">Error: </strong>
           <span className="block sm:inline">{error}</span>
           <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <span className="text-xl leading-none">&times;</span>
           </button>
         </div>
       )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Shipping & Payment */}
        <div className="space-y-12">
          {/* Shipping Form Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Shipping Information</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
              <InputField id="email" name="email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <InputField id="first_name" name="first_name" label="First Name" placeholder="John" value={shippingAddress.first_name} onChange={handleAddressChange} required />
                <InputField id="last_name" name="last_name" label="Last Name" placeholder="Doe" value={shippingAddress.last_name} onChange={handleAddressChange} required />
              </div>
              <InputField id="address_1" name="address_1" label="Address" placeholder="123 Main St" value={shippingAddress.address_1} onChange={handleAddressChange} required />
              <InputField id="city" name="city" label="City" placeholder="Anytown" value={shippingAddress.city} onChange={handleAddressChange} required />
              <div className="grid grid-cols-2 gap-4">
                <InputField id="province" name="province" label="State / Province" placeholder="CA" value={shippingAddress.province} onChange={handleAddressChange} required />
                <InputField id="postal_code" name="postal_code" label="ZIP / Postal Code" placeholder="90210" value={shippingAddress.postal_code} onChange={handleAddressChange} required />
              </div>
              <InputField id="phone" name="phone" label="Phone (Optional)" type="tel" placeholder="555-123-4567" value={shippingAddress.phone || ''} onChange={handleAddressChange} />
              <button
                type="submit"
                disabled={isLoadingShipping}
                className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingShipping ? "Validating Address..." : "Set Address & View Shipping"}
              </button>
            </form>
          </section>

          {/* Shipping Options Section - Conditionally Render */}
          {isAddressSet && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Shipping Method</h2>
              {isLoadingShipping ? (
                 <p className="text-gray-500 bg-white p-6 rounded-lg shadow animate-pulse">Loading shipping options...</p>
              ) : shippingOptions.length > 0 ? (
                <div className="space-y-3 bg-white p-6 rounded-lg shadow">
                  {shippingOptions.map((option: StoreCartShippingOption) => (
                    <div
                      key={option.id}
                      onClick={() => !isInitializingPayment && handleShippingSelect(option.id!)}
                      className={`p-4 border rounded-md cursor-pointer transition-all duration-200 ${selectedShipping === option.id ? 'border-brand-pink ring-2 ring-brand-pink bg-pink-50' : 'border-gray-200 hover:border-gray-400'} ${isInitializingPayment ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">{option.name}</p>
                        <p className="text-gray-900">{formatPrice(option.amount || 0, cart.region?.currency_code)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isLoadingShipping && <p className="text-gray-500 bg-white p-6 rounded-lg shadow">No shipping options available for this address.</p>
              )}
            </section>
          )}

          {/* Payment Section - Conditionally Render */}
          {selectedShipping && (
             <section>
               <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Payment</h2>
               {isInitializingPayment ? (
                  <div className="text-center p-4 bg-white rounded-lg shadow text-gray-500 animate-pulse">Initializing Payment...</div>
               ) : paymentSessionClientSecret ? (
                 <div className="bg-white p-6 rounded-lg shadow">
                   <StripePayment clientSecret={paymentSessionClientSecret} />
                 </div>
               ) : (
                 error && <p className="text-red-500 bg-white p-6 rounded-lg shadow">Could not initialize payment. Please check address and shipping, or try again.</p>
               )}
             </section>
          )}

        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-gray-50 p-6 lg:p-8 rounded-lg shadow-md h-fit sticky top-28 lg:top-32">
           <h2 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h2>
            {cart.items && cart.items.length > 0 ? (
             <div className="space-y-3">
               {cart.items.map((item: StoreCartLineItem) => (
                 <div key={item.id} className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-b-0">
                   <div className="flex items-start space-x-3 flex-grow min-w-0">
                      <img src={item.thumbnail || '/placeholder.png'} alt={item.title} className="w-16 h-20 object-cover rounded flex-shrink-0"/>
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-gray-700 text-sm sm:text-base line-clamp-2 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.variant?.title ? `(${item.variant.title})` : ''} Qty: {Number(item.quantity)}
                        </p>
                      </div>
                   </div>
                   <p className="text-gray-900 text-right text-sm sm:text-base ml-2 flex-shrink-0">{formatPrice(item.total || 0, cart.region?.currency_code)}</p>
                 </div>
               ))}
               <div className="space-y-2 text-gray-700 pt-4 border-t border-gray-200 mt-4">
                 <div className="flex justify-between text-sm">
                   <span>Subtotal</span>
                   <span>{formatPrice(cart.subtotal || 0, cart.region?.currency_code)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span>Shipping</span>
                   <span>{formatPrice(cart.shipping_total || 0, cart.region?.currency_code)}</span>
                 </div>
                 <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300 mt-2 text-gray-900">
                   <span>Total</span>
                   <span>{formatPrice(cart.total || 0, cart.region?.currency_code)}</span>
                 </div>
               </div>
             </div>
           ) : (
             <p className="text-gray-500">Your cart is empty.</p>
           )}
        </div>
      </div>
    </div>
  );
}


// Simple InputField component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  error?: string;
}
const InputField = ({ id, name, label, error, ...props }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={id} name={name} className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink focus:ring-opacity-50 p-3 ${error ? 'border-red-500' : ''}`} {...props} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);