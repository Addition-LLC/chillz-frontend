"use client";

import { useAuth } from "@/context/AuthContext";
import medusaClient from "@/lib/medusa";
import type { StoreOrder, HttpTypes } from "@medusajs/types";
import { useEffect, useState } from "react";
import Image from "next/image";

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

// Helper to get a status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'fulfilled':
    case 'shipped':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'requires_action':
      return 'bg-yellow-100 text-yellow-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function OrderHistoryPage() {
  const { customer } = useAuth(); // Get customer from context
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch orders if the customer is logged in
    if (customer) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          // Use the correct SDK method: store.order.list()
          const { orders } = await medusaClient.store.order.list();
          setOrders(orders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [customer]); // Re-run when customer data becomes available

  if (isLoading) {
    // Simple loading skeleton
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse h-24 w-full"></div>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse h-24 w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-0">Order History</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: HttpTypes.StoreOrder) => (
            <div key={order.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">#{order.display_id}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <p className="text-sm text-gray-600">Placed on</p>
                  <p className="font-medium text-gray-800">{formatDate(order.created_at)}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="py-4 space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.thumbnail || '/placeholder.png'} 
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {Number(item.quantity)}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-medium text-gray-900">{formatPrice(item.total, order.currency_code)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer - Status & Total */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">Status:</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                      getStatusColor(order.fulfillment_status)
                    }`}>
                      {order.fulfillment_status.replace(/_/g, ' ')}
                    </span>
                </div>
                 <div className="mt-2 sm:mt-0 sm:text-right">
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(order.total, order.currency_code)}</p>
                 </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <p className="text-center text-gray-500">You have not placed any orders yet.</p>
        </div>
      )}
    </div>
  );
}