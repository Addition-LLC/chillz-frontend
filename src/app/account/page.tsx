"use client";

import { useAuth } from "@/context/AuthContext";
import medusaClient from "@/lib/medusa";
import type { HttpTypes } from "@medusajs/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle, 
  Package, 
  RotateCcw, 
  CreditCard, 
  MapPin,
  ClipboardList,
  Truck,
  Home,
  ArrowRight
} from "lucide-react";

// Helper to format prices
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
    { id: 'placed', name: 'Placed', status: 'complete', icon: Package },
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
    <div className="w-full">
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-none -z-10" />
        
        {steps.map((step, stepIdx) => {
          const isComplete = step.status === 'complete';
          const isCurrent = step.status === 'current';
          
          return (
            <div key={step.name} className="flex flex-col items-center bg-white px-2">
              <div className={`
                flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-none border-2 transition-all duration-300
                ${isComplete ? 'bg-black border-black text-white' : 
                  isCurrent ? 'bg-white border-black text-black ring-4 ring-black/5' : 
                  'bg-white border-gray-200 text-gray-300'}
              `}>
                {isComplete ? (
                  <CheckCircle size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <span className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                isComplete || isCurrent ? 'text-black' : 'text-gray-400'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
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
            fields: "id,status,display_id,created_at,total,currency_code,*items,*shipping_address,*fulfillments",
          });
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
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-none animate-pulse mb-8"></div>
        <div className="bg-white p-8 rounded-none shadow-lg animate-pulse h-64 w-full border border-gray-100"></div>
        <div className="bg-white p-8 rounded-none shadow-lg animate-pulse h-64 w-full border border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
          Order History
        </h2>
        <p className="text-gray-600">
          Track your past purchases and manage returns.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order: HttpTypes.StoreOrder) => (
              <div key={order.id} className="bg-white rounded-none shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl duration-300">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-6 bg-gray-50/50 border-b border-gray-100">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                    <p className="text-xl font-bold text-black font-caviar">#{order.display_id}</p>
                  </div>
                  <div className="flex gap-8 sm:text-right">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date Placed</p>
                      <p className="font-medium text-gray-800">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-bold text-xl text-black">
                        {formatPrice(order.total, order.currency_code)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Tracker */}
                <div className="py-8 px-6 sm:px-10 bg-white">
                  <OrderStatusTracker order={order} />
                </div>
                
                {/* Order Items */}
                <div className="px-6 pb-6 space-y-6">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-none bg-gray-50 border border-gray-100 hover:border-black/20 transition-colors">
                        <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-none border border-gray-200">
                          <Image
                            src={item.thumbnail || '/placeholder.png'} 
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <Link href={`/products/${item.product_handle}`} className="font-bold text-black truncate hover:text-gray-600 transition-colors text-lg">
                            {item.title}
                          </Link>
                          {item.subtitle && <p className="text-sm text-gray-500">{item.subtitle}</p>}
                          <p className="text-sm text-gray-500 mt-1">Quantity: <span className="font-medium text-gray-900">{Number(item.quantity)}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-black">{formatPrice(item.total, order.currency_code)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-black uppercase tracking-wider mb-3">
                        <MapPin size={16} className="text-black" />
                        Shipping Address
                      </h3>
                      {order.shipping_address ? (
                        <div className="text-sm text-gray-600 space-y-1 pl-6 border-l-2 border-gray-100">
                          <p className="font-bold text-gray-800">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                          <p>{order.shipping_address.address_1}</p>
                          {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                          <p>
                            {[
                              order.shipping_address.city,
                              order.shipping_address.province,
                              order.shipping_address.postal_code
                            ].filter(Boolean).join(', ')}
                          </p>
                          <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 pl-6">No shipping address provided.</p>
                      )}
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-black uppercase tracking-wider mb-3">
                        <CreditCard size={16} className="text-black" />
                        Payment Status
                      </h3>
                      <div className="pl-6 border-l-2 border-gray-100">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wide
                          ${order.payment_status === 'captured' ? 'bg-green-100 text-green-700' : 
                            order.payment_status === 'awaiting' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-gray-100 text-gray-700'}
                        `}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'delivered') && (
                    <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                      <Link
                        href={`/account/orders/${order.id}/return`}
                        className="group flex items-center gap-2 text-sm font-bold py-3 px-6 rounded-none bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                        Request Return
                      </Link>
                    </div>
                  )}
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-none shadow-lg border border-gray-100 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-none flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-black" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-8">Looks like you haven&apost placed any orders yet. Start shopping to see your history here!</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-black text-white font-bold py-3 px-8 rounded-none hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}