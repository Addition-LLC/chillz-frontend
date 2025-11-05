"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast'; // For notifications

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is where you would send the form data to a backend endpoint or email service
    // For this example, we'll just simulate a success
    console.log({ name, email, subject, message });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast.success("Thank you for your message! We'll be in touch soon.");
    
    // Clear the form
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      {/* Toaster for notifications */}
      <Toaster position="bottom-right" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl lg:text-5xl font-bold mb-4" 
              style={{ fontFamily: 'var(--font-playfair-display)' }}
            >
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question about our products, an order, or just want to say hello? 
              We&apos;d love to hear from you.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            
            {/* Column 1: Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair-display)' }}>
                Get in Touch
              </h2>
              <p className="text-gray-600">
                You can reach us using the details below or by filling out the contact form. 
                We aim to respond within 24 business hours.
              </p>
              
              <div className="space-y-4">
                <a href="mailto:info@nhimwenluxuryhair.com" className="flex items-center gap-3 group">
                  <Mail className="h-5 w-5 text-brand-brown/70 transition-colors group-hover:text-brand-pink" />
                  <span className="text-gray-700 group-hover:text-brand-pink transition-colors">info@nhimwenluxuryhair.com</span>
                </a>
                <a href="tel:+15559876543" className="flex items-center gap-3 group">
                  <Phone className="h-5 w-5 text-brand-brown/70 transition-colors group-hover:text-brand-pink" />
                  <span className="text-gray-700 group-hover:text-brand-pink transition-colors">+1 (555) 987-6543</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-brown/70 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    123 Fashion Street, Beauty City, Style 12345
                    <br />
                    (By Appointment Only)
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField id="name" name="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <InputField id="email" name="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <InputField id="subject" name="subject" label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <TextAreaField id="message" name="message" label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Reusable Form Field Components ---
// (We can move these to a shared file later)

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

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label: string;
  error?: string;
}

const TextAreaField = ({ id, name, label, error, ...props }: TextAreaFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea id={id} name={name} rows={4} className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink focus:ring-opacity-50 p-3 ${error ? 'border-red-500' : ''}`} {...props} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
