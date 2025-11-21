"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate password reset request
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log({ email });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive instructions."
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-brand-brown mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border-gray-200 bg-gray-50 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink/20 focus:bg-white transition-all duration-200 p-4"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-brown text-white font-bold py-4 px-6 rounded-full hover:bg-brand-pink transition-all duration-300 disabled:opacity-50 disabled:hover:bg-brand-brown flex items-center justify-center gap-2 group shadow-lg shadow-brand-brown/20"
          >
            {isLoading ? "Sending..." : "Send Instructions"}
            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="text-center mt-8">
            <Link href="/login" className="text-gray-600 hover:text-brand-brown transition-colors flex items-center justify-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-100">
            <p className="font-medium">Check your email</p>
            <p className="text-sm mt-1">We&apos;ve sent password reset instructions to {email}</p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-brand-brown font-bold hover:text-brand-pink transition-colors"
          >
            Try another email
          </button>
          <div className="pt-4">
             <Link href="/login" className="text-gray-600 hover:text-brand-brown transition-colors flex items-center justify-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}