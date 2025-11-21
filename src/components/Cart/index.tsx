"use client";

import { useCart } from "@/context/CartContext";
import { Fragment, useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from "next/image";
import medusaClient from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import toast from 'react-hot-toast';

export default function Cart() {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    setCart,
  } = useCart();
  
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Memoized values for cart items and totals
  const cartItems = useMemo(() => cart?.items || [], [cart?.items]);
  const cartCount = useMemo(() => 
    cartItems.reduce((acc: number, item: HttpTypes.StoreCartLineItem) => acc + Number(item.quantity), 0), 
  [cartItems]);
  const totalPrice = useMemo(() => (cart ? Number(cart.subtotal) : 0), [cart]);
  
  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    // FIX 1: Add check for cart and cart.items
    if (!cart?.id || !cart.items || updatingItemId) return;

    if (quantity < 1) {
      return handleRemoveItem(lineId);
    }
    
    const originalCart = cart;

    // Optimistically update the UI
    const updatedItems = cart.items.map(item =>
      item.id === lineId ? { ...item, quantity: quantity, total: (item.unit_price || 0) * quantity } : item
    );
    const newSubtotal = updatedItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
    
    setCart({
      ...cart,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newSubtotal + (cart.shipping_total || 0) 
    } as HttpTypes.StoreCart);
    
    setUpdatingItemId(lineId);

    try {
      const { cart: updatedCart } = await medusaClient.store.cart.updateLineItem(cart.id, lineId, {
        quantity,
      });
      setCart(updatedCart); 
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setCart(originalCart); 
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    // FIX 2: Add check for cart and cart.items
    if (!cart?.id || !cart.items || updatingItemId) return;

    const originalCart = cart;

    const updatedItems = cart.items.filter(item => item.id !== lineId);
    const newSubtotal = updatedItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0);

    setCart({
      ...cart,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newSubtotal + (cart.shipping_total || 0)
    } as HttpTypes.StoreCart);
    
    setUpdatingItemId(lineId);

    try {
      // FIX 3: The delete method returns 'parent', not 'cart'
      const { parent: updatedCart } = await medusaClient.store.cart.deleteLineItem(cart.id, lineId);
      setCart(updatedCart); // Set final server state
    } catch (error) {
      console.error("Failed to remove item:", error);
      setCart(originalCart);
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Corrected formatPrice function
  const formatPrice = (amount: number | string | null | undefined, currencyCode: string) => {
    if (amount === null || amount === undefined || !currencyCode) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount));
  };

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart ({cartCount})</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={closeCart}
                          >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root relative">
                          {updatingItemId && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                               <p className="text-gray-700 font-semibold">Updating...</p>
                            </div>
                          )}
                          {cartItems.length > 0 ? (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item: HttpTypes.StoreCartLineItem) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image 
                                      src={item.thumbnail || '/placeholder.png'} 
                                      alt={item.title} 
                                      width={100} 
                                      height={100} 
                                      className="h-full w-full object-cover object-center" 
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.title}</h3>
                                        <p className="ml-4">{formatPrice(item.total, cart?.region?.currency_code || 'USD')}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">{item.variant?.title}</p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <button 
                                          onClick={() => handleUpdateQuantity(item.id, Number(item.quantity) - 1)} 
                                          disabled={!!updatingItemId}
                                          className="px-2 text-lg disabled:opacity-50 text-gray-600"
                                        >-</button>
                                        <p className="text-gray-700 mx-2">Qty {item.quantity}</p>
                                        <button 
                                          onClick={() => handleUpdateQuantity(item.id, Number(item.quantity) + 1)} 
                                          disabled={!!updatingItemId}
                                          className="px-2 text-lg disabled:opacity-50 text-gray-600"
                                        >+</button>
                                      </div>
                                      <div className="flex">
                                        <button
                                          onClick={() => handleRemoveItem(item.id)}
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                                          disabled={!!updatingItemId}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-center text-gray-500">Your cart is empty.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{formatPrice(totalPrice, cart?.region?.currency_code || 'USD')}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <Link
                          href="/checkout"
                          onClick={closeCart}
                          className="flex items-center justify-center rounded-md border border-transparent bg-brand-brown px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}