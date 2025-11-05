"use client";

import medusaClient from "@/lib/medusa";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Call the correct SDK method
      await medusaClient.auth.resetPassword("customer", "emailpass", {
        identifier: email,
      });
      setMessage("If an account exists for this email, password reset instructions have been sent.");
    } catch (err: any) {
      console.error("Forgot Password Error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Forgot Your Password?
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
        Enter your email address below, and we&apos;ll send you instructions to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-white p-8 shadow-md rounded-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <InputField id="email" name="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Request Password Reset"}
        </button>
        <p className="text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-brand-pink hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

// Simple InputField component (assuming it's defined elsewhere or add it here)
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