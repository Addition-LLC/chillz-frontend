"use client";

import { useAuth } from "@/context/AuthContext";
import medusaClient from "@/lib/medusa";
import type { StoreCustomerAddress } from "@medusajs/types";
import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react"; // Import icons
import toast from "react-hot-toast"; // For notifications

export default function AddressesPage() {
  const { customer } = useAuth();
  const [addresses, setAddresses] = useState<StoreCustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false); // To toggle the "Add New" form

  // Fetch addresses when the component loads
  const fetchAddresses = async () => {
    try {
      // As per docs: sdk.store.customer.listAddress()
      const { addresses } = await medusaClient.store.customer.listAddress();
      setAddresses(addresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to load addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if the customer is logged in
    if (customer) {
      fetchAddresses();
    }
  }, [customer]); // Re-run if customer loads

  // Delete an address
  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        // As per docs: sdk.store.customer.deleteAddress(id)
        await medusaClient.store.customer.deleteAddress(addressId);
        toast.success("Address deleted!");
        fetchAddresses(); // Refresh the list
      } catch (err: any) {
        toast.error(err.message || "Failed to delete address.");
      }
    }
  };

  if (isLoading) {
    return <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md animate-pulse">Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Addresses</h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="flex items-center gap-2 bg-brand-brown text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <Plus size={18} /> {isFormVisible ? "Cancel" : "Add New"}
        </button>
      </div>

      {/* Add New Address Form (Toggles) */}
      {isFormVisible && (
        <AddressForm 
          onAddressAdded={() => {
            fetchAddresses(); // Refresh list after adding
            setIsFormVisible(false); // Hide form
          }} 
        />
      )}

      {/* List of Existing Addresses */}
      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className="bg-white p-5 rounded-lg shadow-md flex justify-between items-start">
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{address.first_name} {address.last_name}</p>
                <p>{address.address_1}</p>
                {address.address_2 && <p>{address.address_2}</p>}
                <p>{address.city}, {address.province} {address.postal_code}</p>
                <p>{address.country_code?.toUpperCase()}</p>
                {address.phone && <p className="mt-2">{address.phone}</p>}
              </div>
              <button 
                onClick={() => handleDeleteAddress(address.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete address"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          !isFormVisible && (
             <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <p className="text-gray-500">You have no saved addresses.</p>
             </div>
          )
        )}
      </div>
    </div>
  );
}

// --- Reusable Address Form Component ---

interface AddressFormProps {
  onAddressAdded: () => void; // Callback function
}

const AddressForm = ({ onAddressAdded }: AddressFormProps) => {
  const [address, setAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "us", // Default to US
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // As per docs: sdk.store.customer.createAddress(body)
      await medusaClient.store.customer.createAddress(address);
      toast.success("Address added successfully!");
      onAddressAdded(); // Call the callback to refresh list and hide form
    } catch (err: any) {
      console.error("Failed to add address:", err);
      setError(err.message || "Failed to save address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-lg shadow-md">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="first_name" name="first_name" label="First Name" value={address.first_name} onChange={handleChange} required />
        <InputField id="last_name" name="last_name" label="Last Name" value={address.last_name} onChange={handleChange} required />
      </div>
      <InputField id="address_1" name="address_1" label="Address" placeholder="123 Main St" value={address.address_1} onChange={handleChange} required />
      <InputField id="address_2" name="address_2" label="Apartment, suite, etc. (Optional)" placeholder="" value={address.address_2 || ''} onChange={handleChange} />
      <InputField id="city" name="city" label="City" value={address.city} onChange={handleChange} required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="province" name="province" label="State / Province" value={address.province} onChange={handleChange} required />
        <InputField id="postal_code" name="postal_code" label="ZIP / Postal Code" value={address.postal_code} onChange={handleChange} required />
      </div>
      {/* TODO: Add a Country <select> input to change country_code */}
      <InputField id="phone" name="phone" label="Phone (Optional)" type="tel" value={address.phone || ''} onChange={handleChange} />
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-brand-brown text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Address"}
        </button>
      </div>
    </form>
  );
};

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