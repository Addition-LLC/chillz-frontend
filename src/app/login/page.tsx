"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Please enter your details to sign in."
    >
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

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Password
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
          <div className="flex justify-end mt-2">
            <Link 
              href="/forgot-password" 
              className="text-sm text-black hover:text-gray-600 transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-black flex items-center justify-center gap-2 group shadow-lg"
        >
          {isLoading ? "Signing in..." : "Sign In"}
          {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-black font-bold hover:text-gray-600 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}