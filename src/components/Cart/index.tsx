'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { isCartOpen, closeCart, cartItems, cartCount, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <div className={`relative z-50 ${isCartOpen ? '' : 'hidden'}`} aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeCart}></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-brand-tan shadow-xl text-brand-brown">
                <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium" id="slide-over-title">Shopping cart</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button type="button" className="-m-2 p-2" onClick={closeCart}>
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    {cartCount === 0 ? (
                       <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <ShoppingBag className="h-16 w-16 text-brand-brown/30" />
                          <p className="mt-4 text-lg font-medium">Your cart is empty</p>
                          <p className="mt-2 text-sm text-brand-brown/60">Looks like you haven't added anything yet.</p>
                          <Link href="/tools" onClick={closeCart} className="mt-6 rounded-md bg-brand-pink px-6 py-3 text-base font-medium text-brand-brown shadow-sm hover:opacity-90">
                            Start Shopping
                          </Link>
                        </div>
                    ) : (
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-brand-brown/20">
                          {cartItems.map((item) => (
                            <li key={item.id} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-brand-brown/10">
                                <Image src={item.imageUrl} alt={item.name} width={100} height={100} className="h-full w-full object-cover object-center" />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium">
                                    <h3><Link href={`/product/${item.id}`}>{item.name}</Link></h3>
                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-brand-brown/60">Length: {item.lengths[0]}"</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center border border-gray-300 rounded">
                                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1"><Minus className="h-3 w-3" /></button>
                                      <span className="px-3 text-sm">{item.quantity}</span>
                                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1"><Plus className="h-3 w-3" /></button>
                                  </div>
                                  <div className="flex">
                                    <button type="button" onClick={() => removeFromCart(item.id)} className="font-medium text-brand-pink hover:opacity-80">Remove</button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {cartCount > 0 && (
                  <div className="border-t border-brand-brown/20 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium">
                      <p>Subtotal</p>
                      <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-brand-brown/60">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center rounded-md border border-transparent bg-brand-pink px-6 py-3 text-base font-medium text-brand-brown shadow-sm hover:opacity-90">
                        Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}