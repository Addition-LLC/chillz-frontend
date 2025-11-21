"use client";

import medusaClient from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Check, Package, MapPin, Calendar, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function OrderConfirmedPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const { order } = await medusaClient.store.order.retrieve(orderId, {
            fields: "*items,*items.variant,*shipping_address,*billing_address,*payment_collections,*fulfillments",
          });
          setOrder(order);
        } catch (err: any) {
          console.error("Error fetching order:", err);
          setError("Failed to load order details.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const formatPrice = (amount: number | undefined | null, currencyCode: string | undefined): string => {
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-tan">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-brand-brown border-t-transparent animate-spin mb-4"></div>
          <p className="text-brand-brown font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-tan px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <ShoppingBag className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-brand-brown mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Order Not Found</h1>
          <p className="text-brand-brown/70 mb-8">{error || "We couldn't find the order you're looking for."}</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-brand-brown hover:bg-brand-brown/90 transition-all duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-tan pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-6 animate-fade-in-up">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Thank You!
          </h1>
          <p className="text-xl text-brand-brown/70 font-light">
            Your order <span className="font-bold text-brand-brown">#{order.display_id}</span> has been confirmed.
          </p>
          <p className="text-brand-brown/60 mt-2">
            We&apos;ve sent a confirmation email to <span className="font-medium">{order.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Order Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Items List */}
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-brand-brown/10">
              <h2 className="text-xl font-bold text-brand-brown mb-6 pb-4 border-b border-gray-100" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
                Order Items
              </h2>
              <div className="space-y-6">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-6">
                    <div className="relative h-24 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-brand-brown text-xs font-bold text-white shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-brand-brown text-lg">{item.title}</h3>
                      <p className="text-sm text-brand-brown/60 mb-2">{item.variant?.title}</p>
                      <p className="font-medium text-brand-brown">
                        {formatPrice(item.unit_price, order.currency_code)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-brown text-lg">
                        {formatPrice(item.total, order.currency_code)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-brand-brown/10">
                <div className="flex items-center gap-2 mb-4 text-brand-brown">
                  <MapPin className="h-5 w-5 text-brand-pink" />
                  <h3 className="font-bold" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Shipping Address</h3>
                </div>
                <address className="not-italic text-brand-brown/80 text-sm leading-relaxed">
                  <p className="font-bold text-brand-brown mb-1">
                    {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                  </p>
                  <p>{order.shipping_address?.address_1}</p>
                  {order.shipping_address?.address_2 && <p>{order.shipping_address?.address_2}</p>}
                  <p>
                    {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}
                  </p>
                  <p>{order.shipping_address?.country_code?.toUpperCase()}</p>
                </address>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-brand-brown/10">
                <div className="flex items-center gap-2 mb-4 text-brand-brown">
                  <Calendar className="h-5 w-5 text-brand-pink" />
                  <h3 className="font-bold" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Order Details</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-brown/60">Order Date</span>
                    <span className="font-medium text-brand-brown">{formatDate(order.created_at as string)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-brown/60">Payment Method</span>
                    <span className="font-medium text-brand-brown capitalize">
                      {order.payment_collections?.[0]?.payment_sessions?.[0]?.provider_id?.replace(/_/g, ' ') || 'Credit Card'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-brown/60">Shipping Method</span>
                    <span className="font-medium text-brand-brown">
                      {order.shipping_methods?.[0]?.name || 'Standard Shipping'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-brown text-brand-tan rounded-2xl shadow-lg p-6 lg:p-8 sticky top-32">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-brand-tan/20" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-brand-tan/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-brand-tan/80">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-brand-tan/80">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax_total, order.currency_code)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-brand-tan/20 mt-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-bold">{formatPrice(order.total, order.currency_code)}</span>
                </div>
              </div>

              <div className="mt-8">
                <Link 
                  href="/" 
                  className="block w-full py-4 px-6 bg-brand-tan text-brand-brown font-bold text-center rounded-xl hover:bg-white transition-colors duration-300 shadow-md hover:shadow-lg group"
                >
                  Continue Shopping
                  <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}