"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import medusaClient from "@/lib/medusa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
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
      // 1. Register the customer
      // Note: The SDK signature for register might vary, but typically it's (actor, provider, payload)
      // or just store.customer.create if auth module isn't fully used for registration in older patterns.
      // Based on SDK inspection: register(actor, method, payload)
      
      // Splitting name into first and last name for Medusa
      const nameParts = name.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ") || "";

      await medusaClient.auth.register("customer", "emailpass", {
        email,
        password,
        first_name,
        last_name
      });

      // 2. Log them in immediately to establish the session
      await login(email, password);

      toast.success("Account created successfully!");
      router.push("/account");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join us to experience luxury hair care."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-none border-gray-200 bg-gray-50 shadow-sm focus:border-black focus:ring focus:ring-black/5 focus:bg-white transition-all duration-200 p-4"
            placeholder="Jane Doe"
            required
          />
        </div>

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
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-black flex items-center justify-center gap-2 group shadow-lg"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
          {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-black font-bold hover:text-gray-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}