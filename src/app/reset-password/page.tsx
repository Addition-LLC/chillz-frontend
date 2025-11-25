"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log({ password });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Please enter your new password below."
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-none border-gray-200 bg-gray-50 shadow-sm focus:border-black focus:ring focus:ring-black/5 focus:bg-white transition-all duration-200 p-4 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-none border-gray-200 bg-gray-50 shadow-sm focus:border-black focus:ring focus:ring-black/5 focus:bg-white transition-all duration-200 p-4 pr-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg"
          >
            {isLoading ? "Updating..." : "Update Password"}
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
            <p className="font-medium">Password Updated</p>
            <p className="text-sm mt-1">Your password has been successfully reset.</p>
          </div>
          <Link 
            href="/login"
            className="inline-flex w-full bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-all duration-300 items-center justify-center gap-2 group shadow-lg"
          >
            Sign In Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}