"use client";

import { useAuth } from "@/context/AuthContext";
import medusaClient from "@/lib/medusa";
import type { HttpTypes } from "@medusajs/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Import more icons for a richer status tracker
import { 
  CheckCircle, 
  Package, 
  RotateCcw, 
  CreditCard, 
  MapPin,
  ClipboardList, // New
  Truck,         // New
  Home           // New
} from "lucide-react";

// Helper to format prices
const formatPrice = (amount: number | string | undefined | null, currencyCode: string | undefined): string => {
  if (amount === undefined || amount === null || !currencyCode) return 'N/A';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount) / 100);
  } catch (error) {
    console.error("Error formatting price:", error);
    return 'Invalid Price';
  }
};

// Helper to format dates
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Enhanced Feature: Order Status Component ---
const OrderStatusTracker = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const { fulfillment_status } = order;

  const isShipped = fulfillment_status === 'shipped' || fulfillment_status === 'delivered' || fulfillment_status === 'fulfilled';
  const isDelivered = fulfillment_status === 'delivered' || fulfillment_status === 'fulfilled';

  const steps = [
    { id: 'placed', name: 'Order Placed', status: 'complete', icon: Package },
    {
      id: 'processing',
      name: 'Processing',
      status: (fulfillment_status === 'not_fulfilled' || fulfillment_status === 'partially_fulfilled')
        ? 'current'
        : (isShipped)
          ? 'complete'
          : 'upcoming',
      icon: ClipboardList
    },
    {
      id: 'shipped',
      name: 'Shipped',
      status: fulfillment_status === 'shipped'
        ? 'current'
        : isDelivered
          ? 'complete'
          : 'upcoming',
      icon: Truck
    },
    {
      id: 'delivered',
      name: 'Delivered',
      status: isDelivered ? 'complete' : 'upcoming',
      icon: Home
    }
  ];

  return (
    <nav className="flex items-center" aria-label="Progress">
      {steps.map((step, stepIdx) => (
        <div key={step.name} className={`relative ${stepIdx === steps.length - 1 ? 'flex-shrink-0' : 'flex-1'}`}>
          {/* Connecting line */}
          {stepIdx > 0 && (
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 ${
              step.status === 'complete' ? 'bg-green-600' : 'bg-gray-200'
            }`} aria-hidden="true" />
          )}
          
          <div className="relative flex flex-col items-center text-center">
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${
              step.status === 'complete' ? 'bg-green-600' :
              step.status === 'current' ? 'bg-brand-brown ring-4 ring-white' : // Assuming 'brand-brown'
              'bg-gray-300'
            }`}>
              {step.status === 'complete' ? (
                <CheckCircle className="h-7 w-7 text-white" />
              ) : (
                <step.icon className={`h-7 w-7 ${step.status === 'current' ? 'text-white' : 'text-gray-500'}`} />
              )}
            </span>
            <span className={`mt-2 text-xs sm:text-sm font-medium ${
              step.status === 'current' ? 'text-brand-brown' : 'text-gray-500'
            }`}>{step.name}</span>
          </div>
        </div>
      ))}
    </nav>
  );
};


export default function OrderHistoryPage() {
  const { customer } = useAuth();
  const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customer) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const { orders } = await medusaClient.store.order.list({
            expand: "items,shipping_address,fulfillments"
          } as any);
          // Sort orders by date, newest first
          const sortedOrders = orders.sort((a, b) => 
            new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
          );
          setOrders(sortedOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [customer]);

  if (isLoading) {
    // A slightly more refined skeleton
    return (
      <div className="max-w-5xl space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse h-60 w-full"></div>
        <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse h-60 w-full"></div>
      </div>
    );
  }

  return (
    // Constrain the width for better readability on large screens
    <div className="max-w-5xl space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-0">Order History</h2>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: HttpTypes.StoreOrder) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="text-lg font-bold text-gray-900">#{order.display_id}</p>
                  </div>
                  <div className="flex gap-6 sm:text-right">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Placed on</p>
                      <p className="font-medium text-gray-800">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total</p>
                      <p className="font-bold text-lg text-gray-900">
                        {formatPrice(order.total, order.currency_code)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Tracker */}
                <div className="py-6 sm:py-8 px-4 sm:px-8">
                  <OrderStatusTracker order={order} />
                </div>
                
                {/* Order Items */}
                <div className="p-4 sm:p-6 space-y-4 border-t border-gray-100">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={item.thumbnail || '/placeholder.png'} 
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        {/* Link to the product page using the 'product_handle' */}
                        <Link href={`/products/${item.product_handle}`} legacyBehavior>
                          <a className="font-semibold text-gray-800 truncate hover:text-brand-brown hover:underline">
                            {item.title}
                          </a>
                        </Link>
                        {item.subtitle && <p className="text-sm text-gray-500">{item.subtitle}</p>}
                        <p className="text-sm text-gray-500">Qty: {Number(item.quantity)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(item.total, order.currency_code)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                      <MapPin size={18} />
                      Shipping To
                    </h3>
                    {order.shipping_address ? (
                      <div className="text-sm text-gray-600 mt-3 space-y-0.5">
                        <p className="font-medium text-gray-700">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                        <p>{order.shipping_address.address_1}</p>
                        {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                        <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
                        <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-3">No shipping address provided.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                      <CreditCard size={18} />
                      Payment
                    </h3>
                    <div className="text-sm text-gray-600 mt-3 space-y-1">
                      <p>
                        Status: 
                        <span className="font-medium capitalize text-gray-900 ml-1.5 py-0.5 px-2 rounded-md bg-green-100 text-green-800">
                          {order.payment_status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {(order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'delivered') && (
                  <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
                    <button
                      onClick={() => alert("Return functionality coming soon!")} 
                      className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <RotateCcw size={16} />
                      Request Return
                    </button>
                  </div>
                )}
              </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <p className="text-center text-gray-500">You have not placed any orders yet.</p>
        </div>
      )}
    </div>
  );
}