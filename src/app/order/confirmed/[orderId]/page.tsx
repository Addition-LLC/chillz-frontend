import medusaClient from "@/lib/medusa";
import type { StoreOrder } from "@medusajs/types";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0; // Disable cache for this page

// Define the expected props, including the dynamic 'orderId' parameter
type Props = {
  params: { orderId: string };
};

// Helper function to fetch the order
async function getOrder(id: string): Promise<StoreOrder | null> {
  try {
    // Use the correct SDK method: store.order.retrieve(id)
    const { order } = await medusaClient.store.order.retrieve(id);
    return order;
  } catch (error) {
    // Log the error and return null if not found
    console.error("Failed to retrieve order:", error);
    return null;
  }
}

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

// The main page component
export default async function OrderConfirmedPage({ params }: Props) {
  const order = await getOrder(params.orderId);

  // If no order is found, show a 404 page
  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-green-600 mb-4" style={{ fontFamily: 'var(--font-playfair-display)' }}>
          Thank You!
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Your order has been successfully placed.
        </p>
        <p className="text-gray-500 mb-8">
          Order ID: <span className="font-semibold text-gray-800">#{order.display_id}</span>
        </p>

        {/* Order Items */}
        <div className="bg-gray-50 p-6 rounded-lg text-left space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0">
                <div className="flex items-start space-x-3 min-w-0">
                  <img src={item.thumbnail || '/placeholder.png'} alt={item.title} className="w-14 h-16 object-cover rounded flex-shrink-0"/>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.variant?.title ? `(${item.variant.title})` : ''} Qty: {Number(item.quantity)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-900 font-medium ml-2">
                  {formatPrice(item.total, order.currency_code)}
                </p>
              </div>
            ))}
          </div>
          
          {/* Order Totals */}
          <div className="space-y-2 text-gray-700 pt-4 border-t border-gray-200 mt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal, order.currency_code)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span>Taxes</span>
              <span>{formatPrice(order.tax_total, order.currency_code)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300 mt-2 text-gray-900">
              <span>Total Paid</span>
              <span>{formatPrice(order.total, order.currency_code)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
         <div className="bg-white p-6 rounded-lg text-left mt-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping To</h3>
            {order.shipping_address ? (
                <div className="text-gray-600 text-sm">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
                    <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                </div>
            ) : (
                <p className="text-gray-600 text-sm">No shipping address provided.</p>
            )}
         </div>

        <Link href="/" className="inline-block mt-8 bg-brand-brown text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}