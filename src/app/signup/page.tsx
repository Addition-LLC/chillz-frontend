"use client";

import { useAuth } from "@/context/AuthContext";
import medusaClient from "@/lib/medusa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FetchError } from "@medusajs/js-sdk";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let authToken: string | undefined = undefined;

    try {
      // Step 1: Get auth token
      try {
        console.log("Attempting registration token...");
        const response = await medusaClient.auth.register("customer", "emailpass", {
          email,
          password,
        });
        authToken = response;
        console.log("Registration token obtained.");

      } catch (registrationError: any) {
        console.warn("Registration token failed:", registrationError);
        const fetchError = registrationError as FetchError;
        
        if (
          fetchError?.status === 401 &&
          fetchError?.message?.includes("Identity with email already exists")
        ) {
          console.log("Email exists, attempting login token...");
          try {
            const loginResponse = await medusaClient.auth.login("customer", "emailpass", {
              email,
              password,
            });

            if (typeof loginResponse === "object") {
               setError("Authentication requires additional steps not supported.");
               setIsLoading(false);
               return;
            }
            authToken = loginResponse;
            console.log("Login token obtained.");
          } catch (loginError: any) {
            console.error("Login attempt failed:", loginError);
            setError("An account with this email exists, but the password was incorrect.");
            setIsLoading(false);
            return;
          }
        } else {
          throw registrationError;
        }
      }

      if (!authToken) {
        throw new Error("Could not obtain an authentication token.");
      }

      console.log("Attempting to create customer...");
      
      //
      // --- THIS IS THE FIX ---
      //
      // Pass 'undefined' for the 2nd (query) argument
      await medusaClient.store.customer.create(
        { // 1. Body
          first_name: firstName,
          last_name: lastName,
          email,
        },
        undefined, 
        { // 3. Headers
          'Authorization': `Bearer ${authToken}`
        }
      );
      console.log("Customer created.");

      // Step 3: Log the user in to establish a session
      console.log("Logging in user to establish session...");
      await login(email, password);

      console.log("Redirecting to account...");
      router.push("/account");

    } catch (err: any) {
      console.error("Overall Signup Error:", err);
      if (err?.message) {
         setError(err.message);
      } else {
         setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Create Account
      </h1>
      <form onSubmit={handleSignUp} className="max-w-md mx-auto space-y-4 bg-white p-8 shadow-md rounded-lg">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <InputField id="firstName" name="firstName" label="First Name" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} required />
        <InputField id="lastName" name="lastName" label="Last Name" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} required />
        <InputField id="email" name="email" label="Email Address" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
        <InputField id="password" name="password" label="Password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required minLength={8}/>
        
        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            style={{ minHeight: '40px', display: 'block' }} 
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

         <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-pink hover:underline">
              Log In
            </Link>
          </p>
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