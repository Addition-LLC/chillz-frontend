// src/app/login/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Log In
      </h1>
      <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4 bg-white p-8 shadow-md rounded-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <InputField id="email" name="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <InputField id="password" name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
        <div className="flex justify-between items-center text-sm"> {/* Flex container for links */}
          <Link href="/forgot-password" className="font-medium text-brand-pink hover:underline">
             Forgot Password?
          </Link>
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-brand-pink hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

// Simple InputField component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  error?: string;
}
const InputField = ({ id, name, label, error, ...props }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={id} name={name} className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink focus:ring-opacity-50 p-3 ${error ? 'border-red-500' : ''}`} {...props} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);