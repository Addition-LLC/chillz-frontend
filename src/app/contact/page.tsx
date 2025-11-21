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
      <div className="min-h-screen bg-brand-tan pt-28 pb-12 lg:pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 
                className="text-4xl lg:text-5xl font-bold mb-4 text-brand-brown" 
                style={{ fontFamily: 'var(--font-caviar-dreams)' }}
              >
                Contact Us
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto font-light">
                Have a question about our products, an order, or just want to say hello? 
                We&apos;d love to hear from you.
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border border-brand-brown/10">
              
              {/* Column 1: Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-brand-brown" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
                  Get in Touch
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  You can reach us using the details below or by filling out the contact form. 
                  We aim to respond within 24 business hours.
                </p>
                
                <div className="space-y-6">
                  <a href="mailto:info@nhimwenluxuryhair.com" className="flex items-center gap-4 group">
                    <div className="bg-brand-tan p-3 rounded-full group-hover:bg-brand-pink/10 transition-colors">
                      <Mail className="h-5 w-5 text-brand-brown transition-colors group-hover:text-brand-pink" />
                    </div>
                    <span className="text-gray-700 group-hover:text-brand-pink transition-colors font-medium">info@nhimwenluxuryhair.com</span>
                  </a>
                  <a href="tel:+15559876543" className="flex items-center gap-4 group">
                    <div className="bg-brand-tan p-3 rounded-full group-hover:bg-brand-pink/10 transition-colors">
                      <Phone className="h-5 w-5 text-brand-brown transition-colors group-hover:text-brand-pink" />
                    </div>
                    <span className="text-gray-700 group-hover:text-brand-pink transition-colors font-medium">+1 (555) 987-6543</span>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-tan p-3 rounded-full mt-1">
                      <MapPin className="h-5 w-5 text-brand-brown" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      123 Fashion Street, Beauty City, Style 12345
                      <br />
                      <span className="text-sm text-gray-500 font-normal">(By Appointment Only)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField id="name" name="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <InputField id="email" name="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <InputField id="subject" name="subject" label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                <TextAreaField id="message" name="message" label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-full hover:bg-brand-pink transition-colors duration-300 disabled:opacity-50 disabled:hover:bg-brand-brown mt-4"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Reusable Form Field Components ---

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  error?: string;
}

const InputField = ({ id, name, label, error, ...props }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-bold text-brand-brown mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>{label}</label>
    <input 
      id={id} 
      name={name} 
      className={`block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink/20 focus:bg-white transition-all duration-200 p-3 ${error ? 'border-red-500' : ''}`} 
      {...props} 
    />
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
    <label htmlFor={id} className="block text-sm font-bold text-brand-brown mb-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>{label}</label>
    <textarea 
      id={id} 
      name={name} 
      rows={4} 
      className={`block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm focus:border-brand-pink focus:ring focus:ring-brand-pink/20 focus:bg-white transition-all duration-200 p-3 ${error ? 'border-red-500' : ''}`} 
      {...props} 
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
