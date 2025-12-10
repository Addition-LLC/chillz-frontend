"use client";

import { useCart } from "@/context/CartContext";
import medusaClient from "@/lib/medusa";
import type { StoreCartShippingOption, StoreCartLineItem } from "@medusajs/types";
import { useState, useEffect } from "react";
import StripePayment from "@/components/Checkout/StripePayment";
import { Check, ChevronRight, CreditCard, Truck, MapPin } from "lucide-react";
import Image from "next/image";

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
  const { cart, setCart, addDiscount, removeDiscount } = useCart();
  const [shippingOptions, setShippingOptions] = useState<StoreCartShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [isAddressSet, setIsAddressSet] = useState(false);
  const [paymentSessionClientSecret, setPaymentSessionClientSecret] = useState<string | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Discount State
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

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

      await medusaClient.store.payment.initiatePaymentSession(
        currentCart,
        {
          provider_id: paymentProviderId,
          data: {}
        }
      );

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

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    setIsApplyingDiscount(true);
    setDiscountError(null);
    try {
      await addDiscount(discountCode);
      setDiscountCode("");
    } catch (_err: any) {
      setDiscountError("Invalid discount code.");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async (code: string) => {
    try {
      await removeDiscount(code);
    } catch (err) {
      console.error("Failed to remove discount", err);
    }
  };

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

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-none border-4 border-black border-t-transparent animate-spin mb-4"></div>
          <p className="text-black font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-10 text-center text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
          Checkout
        </h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-none shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-none p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 8.586 5.757 4.293 4.293 4.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Section 1: Shipping Address */}
            <section className="bg-white rounded-none shadow-sm p-6 lg:p-8 border border-black/10">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Shipping Information</h2>
              </div>
              
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <InputField 
                  id="email" 
                  name="email" 
                  label="Email Address" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  icon={<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-400">@</span></div>}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField id="first_name" name="first_name" label="First Name" placeholder="Jane" value={shippingAddress.first_name} onChange={handleAddressChange} required />
                  <InputField id="last_name" name="last_name" label="Last Name" placeholder="Doe" value={shippingAddress.last_name} onChange={handleAddressChange} required />
                </div>
                
                <InputField 
                  id="address_1" 
                  name="address_1" 
                  label="Address" 
                  placeholder="123 Luxury Lane" 
                  value={shippingAddress.address_1} 
                  onChange={handleAddressChange} 
                  required 
                  icon={<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField id="city" name="city" label="City" placeholder="New York" value={shippingAddress.city} onChange={handleAddressChange} required />
                  <InputField id="province" name="province" label="State / Province" placeholder="NY" value={shippingAddress.province} onChange={handleAddressChange} required />
                  <InputField id="postal_code" name="postal_code" label="ZIP Code" placeholder="10001" value={shippingAddress.postal_code} onChange={handleAddressChange} required />
                </div>
                
                <InputField id="phone" name="phone" label="Phone (Optional)" type="tel" placeholder="(555) 123-4567" value={shippingAddress.phone || ''} onChange={handleAddressChange} />
                
                <button
                  type="submit"
                  disabled={isLoadingShipping}
                  className="w-full mt-4 bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoadingShipping ? (
                    <>
                      <div className="h-4 w-4 rounded-none border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Shipping</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Section 2: Shipping Method */}
            <section className={`bg-white rounded-none shadow-sm p-6 lg:p-8 border border-black/10 transition-opacity duration-300 ${!isAddressSet ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Shipping Method</h2>
              </div>

              {isLoadingShipping ? (
                 <div className="flex items-center justify-center py-8 text-black/60">
                   <div className="h-5 w-5 rounded-none border-2 border-black border-t-transparent animate-spin mr-3"></div>
                   Loading options...
                 </div>
              ) : shippingOptions.length > 0 ? (
                <div className="space-y-3">
                  {shippingOptions.map((option: StoreCartShippingOption) => (
                    <div
                      key={option.id}
                      onClick={() => !isInitializingPayment && handleShippingSelect(option.id!)}
                      className={`relative p-5 border-2 rounded-none cursor-pointer transition-all duration-200 flex items-center justify-between group ${selectedShipping === option.id ? 'border-black bg-black/5' : 'border-gray-100 hover:border-black/50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-5 w-5 rounded-none border flex items-center justify-center ${selectedShipping === option.id ? 'border-black bg-black' : 'border-gray-300'}`}>
                          {selectedShipping === option.id && <div className="h-2 w-2 rounded-none bg-white" />}
                        </div>
                        <div>
                          <p className="font-bold text-black">{option.name}</p>
                          <p className="text-xs text-black/60 flex items-center gap-1 mt-1">
                            <Truck className="h-3 w-3" /> Standard Delivery
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-black">{formatPrice(option.amount || 0, cart.region?.currency_code)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                !isLoadingShipping && <p className="text-gray-500 italic">Please enter a valid shipping address to see options.</p>
              )}
            </section>

            {/* Section 3: Payment */}
            <section className={`bg-white rounded-none shadow-sm p-6 lg:p-8 border border-black/10 transition-opacity duration-300 ${!selectedShipping ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white font-bold text-sm">3</div>
                <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Payment</h2>
              </div>

               {isInitializingPayment ? (
                  <div className="flex flex-col items-center justify-center py-12 text-black/60">
                    <div className="h-8 w-8 rounded-none border-2 border-black border-t-transparent animate-spin mb-2"></div>
                    <p>Securing connection...</p>
                  </div>
               ) : paymentSessionClientSecret ? (
                 <div className="animate-fade-in">
                   <StripePayment clientSecret={paymentSessionClientSecret} />
                 </div>
               ) : (
                 error && <p className="text-red-500 p-4 bg-red-50 rounded-none">Could not initialize payment. Please check your details.</p>
               )}
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-none shadow-lg p-6 lg:p-8 border border-black/10 sticky top-32">
               <h2 className="text-xl font-bold mb-6 text-black pb-4 border-b border-gray-100" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Order Summary</h2>
               
               <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {cart.items?.map((item: StoreCartLineItem) => (
                   <div key={item.id} className="flex gap-4">
                     <div className="relative h-20 w-16 flex-shrink-0 rounded-none overflow-hidden border border-gray-100">
                        <Image src={item.thumbnail || '/placeholder.png'} alt={item.title} fill className="object-cover" />
                        <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-none bg-black text-xs font-bold text-white shadow-sm">
                          {item.quantity}
                        </span>
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="font-medium text-black truncate">{item.title}</h3>
                       <p className="text-sm text-black/60 truncate">{item.variant?.title}</p>
                     </div>
                     <p className="font-bold text-black">{formatPrice((item.unit_price || 0) * (item.quantity || 1), cart.region?.currency_code)}</p>
                   </div>
                 ))}
               </div>

               <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                 {/* Discount Code Section */}
                 <div className="mb-6">
                   <div className="flex gap-2">
                     <input
                       type="text"
                       placeholder="Discount code"
                       className="flex-1 rounded-none border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 py-2 px-3 text-sm"
                       value={discountCode}
                       onChange={(e) => setDiscountCode(e.target.value)}
                     />
                     <button
                       onClick={handleApplyDiscount}
                       disabled={isApplyingDiscount || !discountCode}
                       className="bg-black text-white font-bold py-2 px-4 rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
                     >
                       {isApplyingDiscount ? "..." : "Apply"}
                     </button>
                   </div>
                   {discountError && <p className="text-red-500 text-xs mt-1">{discountError}</p>}
                   
                   {/* Applied Promotions */}
                   {cart.promotions && cart.promotions.length > 0 && (
                     <div className="mt-3 space-y-2">
                       {cart.promotions.map((promo) => (
                         <div key={promo.id} className="flex justify-between items-center bg-green-50 p-2 rounded-none text-sm text-green-700 border border-green-100">
                           <span className="font-medium flex items-center gap-1">
                             <Check className="h-3 w-3" /> {promo.code}
                           </span>
                           <button 
                             onClick={() => handleRemoveDiscount(promo.code!)}
                             className="text-xs hover:text-red-600 underline"
                           >
                             Remove
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>

                 <div className="flex justify-between text-black/80">
                   <span>Subtotal</span>
                   <span>{formatPrice(cart.subtotal, cart.region?.currency_code)}</span>
                 </div>
                 
                 {cart.discount_total && cart.discount_total > 0 && (
                   <div className="flex justify-between text-green-600 font-medium">
                     <span>Discount</span>
                     <span>-{formatPrice(cart.discount_total, cart.region?.currency_code)}</span>
                   </div>
                 )}

                 <div className="flex justify-between text-black/80">
                   <span>Shipping</span>
                   <span>{formatPrice(cart.shipping_total || 0, cart.region?.currency_code)}</span>
                 </div>
                 <div className="flex justify-between text-black/80">
                   <span>Taxes</span>
                   <span>{formatPrice(cart.tax_total || 0, cart.region?.currency_code)}</span>
                 </div>
                 
                 <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                   <span className="text-lg font-bold text-black">Total</span>
                   <span className="text-2xl font-bold text-black">{formatPrice(cart.total || 0, cart.region?.currency_code)}</span>
                 </div>
               </div>

               {/* Trust Badges */}
               <div className="mt-8 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 bg-black rounded-none"><Check className="h-4 w-4 text-white" /></div>
                    <span className="text-[10px] uppercase tracking-wider text-black/60 font-bold">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 bg-black rounded-none"><Truck className="h-4 w-4 text-white" /></div>
                    <span className="text-[10px] uppercase tracking-wider text-black/60 font-bold">Fast</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 bg-black rounded-none"><CreditCard className="h-4 w-4 text-white" /></div>
                    <span className="text-[10px] uppercase tracking-wider text-black/60 font-bold">Encrypted</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  icon?: React.ReactNode;
}

const InputField = ({ id, name, label, icon, ...props }: InputFieldProps) => (
  <div className="relative">
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative">
      {icon}
      <input
        id={id}
        name={name}
        className={`block w-full rounded-none border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 py-3.5 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-black placeholder-gray-400`}
        {...props}
      />
    </div>
  </div>
);
