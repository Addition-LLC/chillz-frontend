"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import medusaClient from "@/lib/medusa";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ReturnPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [returnReasons, setReturnReasons] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: number; reason_id: string }>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderAndReasons();
    }
  }, [id]);

  const fetchOrderAndReasons = async () => {
    setLoading(true);
    try {
      console.log("Fetching order with explicit fields..."); // Debug log to confirm code update
      // Fetch Order
      const { order } = await medusaClient.store.order.retrieve(id as string, {
        fields: "id,display_id,currency_code,items.id,items.title,items.thumbnail,items.quantity,items.variant.title,items.detail.return_requested_quantity,items.detail.return_received_quantity,items.detail.return_dismissed_quantity"
      });
      setOrder(order);

      // Fetch Return Reasons
      try {
        const { return_reasons } = await medusaClient.client.fetch<{ return_reasons: any[] }>("/store/return-reasons");
        setReturnReasons(return_reasons);
      } catch (err) {
        console.warn("Failed to fetch return reasons, using fallback or empty.", err);
        setReturnReasons([
          { id: "rr_unknown", label: "Other" },
          { id: "rr_wrong_size", label: "Wrong Size" },
          { id: "rr_damaged", label: "Damaged" },
          { id: "rr_dont_like", label: "Don't like it" },
        ]);
      }

    } catch (error) {
      console.error("Error loading return data:", error);
      toast.error("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderAndReasons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleQuantityChange = (itemId: string, quantity: number, max: number) => {
    if (quantity < 0) quantity = 0;
    if (quantity > max) quantity = max;

    setSelectedItems(prev => {
      const current = prev[itemId] || { quantity: 0, reason_id: "" };
      if (quantity === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: { ...current, quantity }
      };
    });
  };

  const handleReasonChange = (itemId: string, reasonId: string) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || { quantity: 0, reason_id: "" };
      return {
        ...prev,
        [itemId]: { ...current, reason_id: reasonId }
      };
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedItems).length === 0) {
      toast.error("Please select at least one item to return.");
      return;
    }

    // Validate reasons
    for (const [itemId, data] of Object.entries(selectedItems)) {
      if (!data.reason_id) {
        toast.error("Please select a return reason for all selected items.");
        return;
      }
    }

    setSubmitting(true);
    try {
        const items = Object.entries(selectedItems).map(([item_id, data]) => ({
            item_id,
            quantity: data.quantity,
            reason_id: data.reason_id
        }));

        await medusaClient.client.fetch("/store/returns", {
            method: "POST",
            body: {
                order_id: id,
                items
            }
        });

        toast.success("Return requested successfully!");
        router.push("/account");
    } catch (error: any) {
        console.error("Return submission error:", error);
        toast.error(error.message || "Failed to submit return request.");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-black border-t-transparent animate-spin mb-4"></div>
          <p className="text-black font-medium">Loading return details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Order Not Found</h1>
        <Link href="/account" className="text-black hover:underline">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/account" className="inline-flex items-center text-black/60 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </Link>

        <div className="bg-white rounded-none shadow-lg overflow-hidden border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Request Return
          </h1>
          <p className="text-gray-500 mb-8">
            Order #{order.display_id}
          </p>

          <div className="space-y-8">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <div className="relative h-24 w-20 flex-shrink-0 rounded-none overflow-hidden border border-gray-200">
                  <Image 
                    src={item.thumbnail || '/placeholder.png'} 
                    alt={item.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-black text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{item.variant?.title}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Quantity to Return
                      </label>
                        <div className="flex items-center gap-3">
                        {(() => {
                          const quantity = item.quantity || 0;
                          // Calculate returned quantity from detail if direct property is missing
                          const detailReturned = (item.detail?.return_requested_quantity || 0) + (item.detail?.return_received_quantity || 0) + (item.detail?.return_dismissed_quantity || 0);
                          const returned = item.returned_quantity ?? detailReturned;
                          const returnable = Math.max(0, quantity - returned);
                          
                          return (
                            <>
                              <select 
                                className="block w-full rounded-none border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:border-black focus:ring-black"
                                value={selectedItems[item.id]?.quantity || 0}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value), returnable)}
                              >
                                {[...Array(returnable + 1)].map((_, i) => (
                                  <option key={i} value={i}>{i}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                / {returnable} available
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {selectedItems[item.id]?.quantity > 0 && (
                      <div className="animate-fade-in">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                          Reason
                        </label>
                        <select
                          className="block w-full rounded-none border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:border-black focus:ring-black"
                          value={selectedItems[item.id]?.reason_id || ""}
                          onChange={(e) => handleReasonChange(item.id, e.target.value)}
                        >
                          <option value="" disabled>Select a reason</option>
                          {returnReasons.map((reason) => (
                            <option key={reason.id} value={reason.id}>
                              {reason.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(selectedItems).length === 0}
              className="bg-black text-white font-bold py-3 px-8 rounded-none hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Return Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
