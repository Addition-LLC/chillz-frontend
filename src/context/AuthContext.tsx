"use client";

import medusaClient from "@/lib/medusa";
import type { StoreCustomer } from "@medusajs/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  // 1. Allow customer to be undefined (loading)
  customer: Omit<StoreCustomer, "password_hash"> | null | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  retrieveCustomer: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 2. Set initial state to undefined (loading) instead of null
  const [customer, setCustomer] = useState<Omit<StoreCustomer, "password_hash"> | null | undefined>(undefined);

  const retrieveCustomer = async () => {
    try {
      const { customer } = await medusaClient.store.customer.retrieve();
      setCustomer(customer);
    } catch (_error) {
      setCustomer(null); // Set to null on failure (not logged in)
    }
  };

  useEffect(() => {
    retrieveCustomer();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await medusaClient.auth.login("customer", "emailpass", {
        email,
        password,
      });
      await retrieveCustomer();
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Failed to log in. Please check your credentials.");
    }
  };

  const logout = async () => {
    try {
      await medusaClient.auth.logout();
      setCustomer(null); // Set to null on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      // @ts-expect-error - password is valid for update but types might be missing it
      await medusaClient.store.customer.update({ password });
      await retrieveCustomer();
    } catch (error) {
      console.error("Update password failed:", error);
      throw new Error("Failed to update password.");
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        customer, 
        login, 
        logout, 
        retrieveCustomer,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};