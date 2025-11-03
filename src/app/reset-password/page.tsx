"use client";

import medusaClient from "@/lib/medusa";
import { useSearchParams, useRouter } from 'next/navigation'; // Import useSearchParams
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

// Wrap the main component in Suspense for useSearchParams
export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-20 pt-32 lg:pt-40">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}


function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Extract token and email from URL query parameters
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    setToken(urlToken);
    setEmail(urlEmail);

    if (!urlToken || !urlEmail) {
      setError("Invalid or missing reset token/email in URL.");
      // Consider redirecting or showing a more permanent error
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !email) {
      setError("Invalid reset link.");
      return;
    }
    if (password.length < 8) {
       setError("Password must be at least 8 characters long.");
       return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Call the correct SDK method
      await medusaClient.auth.updateProvider("customer", "emailpass", {
        // email is not strictly needed by the API, but good practice to include if available
        email,
        password,
      }, token); // Pass the token as the last argument

      setMessage("Password has been reset successfully! You can now log in.");
      // Optionally redirect to login after a delay
      setTimeout(() => router.push('/login'), 3000);

    } catch (err: any) {
      console.error("Reset Password Error:", err);
      setError(err.message || "Failed to reset password. The token might be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Reset Your Password
      </h1>
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
        {!token || !email ? (
           <p className="text-center text-red-500">Invalid reset link.</p>
        ) : (
          <>
            <InputField id="password" name="password" label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}/>
            <InputField id="confirmPassword" name="confirmPassword" label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button
              type="submit"
              disabled={isLoading || !token || !email}
              className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
         <p className="text-center text-sm">
          <Link href="/login" className="font-medium text-brand-pink hover:underline">
            Back to Log In
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