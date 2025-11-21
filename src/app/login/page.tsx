"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log({ email, password });
    setIsLoading(false);
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Please enter your details to sign in."
    >
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

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-brand-brown mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border-gray-200 bg-gray-50 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink/20 focus:bg-white transition-all duration-200 p-4 pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-brown transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <Link 
              href="/forgot-password" 
              className="text-sm text-brand-brown hover:text-brand-pink transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-brown text-white font-bold py-4 px-6 rounded-full hover:bg-brand-pink transition-all duration-300 disabled:opacity-50 disabled:hover:bg-brand-brown flex items-center justify-center gap-2 group shadow-lg shadow-brand-brown/20"
        >
          {isLoading ? "Signing in..." : "Sign In"}
          {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-brown font-bold hover:text-brand-pink transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}