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
            <label htmlFor="email" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-none border-gray-200 bg-gray-50 shadow-sm focus:border-black focus:ring focus:ring-black/5 focus:bg-white transition-all duration-200 p-4"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg"
          >
            {isLoading ? "Sending..." : "Send Instructions"}
            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="text-center mt-8">
            <Link href="/login" className="text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-green-50 text-green-800 p-4 rounded-none border border-green-100">
            <p className="font-medium">Check your email</p>
            <p className="text-sm mt-1">We&apos;ve sent password reset instructions to {email}</p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-black font-bold hover:text-gray-700 transition-colors"
          >
            Try another email
          </button>
          <div className="pt-4">
             <Link href="/login" className="text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}