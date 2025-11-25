"use client";

import { useAuth } from "@/context/AuthContext";
import medusaClient from "@/lib/medusa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { customer, retrieveCustomer } = useAuth(); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name || "");
      setLastName(customer.last_name || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
    }
  }, [customer]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the SDK to update the customer
      await medusaClient.store.customer.update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });

      // Refresh the customer data in the context
      if (retrieveCustomer) {
        await retrieveCustomer();
      }
      
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-none shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-black">Profile Details</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField id="firstName" name="firstName" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <InputField id="lastName" name="lastName" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <InputField id="email" name="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <InputField id="phone" name="phone" label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-black text-white font-bold py-3 px-6 rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Simple InputField component (You can move this to a shared file)
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  error?: string;
}
const InputField = ({ id, name, label, error, ...props }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-black mb-1">{label}</label>
    <input id={id} name={name} className={`block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black/5 focus:ring-opacity-50 p-3 ${error ? 'border-red-500' : ''}`} {...props} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);