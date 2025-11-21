"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface PromotionCardProps {
  title: string;
  description: string;
  code: string;
  expiry?: string;
  bgColor?: string;
}

export default function PromotionCard({
  title,
  description,
  code,
  expiry,
  bgColor = "bg-brand-brown",
}: PromotionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl ${bgColor}`}>
      {/* Decorative Circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            {title}
          </h3>
          <p className="mb-6 text-white/80 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-white/20 p-1 pl-4 backdrop-blur-sm border border-white/10">
            <span className="font-mono text-lg font-bold tracking-wider">{code}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-brand-brown transition-colors hover:bg-brand-tan"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          
          {expiry && (
            <p className="text-xs text-white/60 text-center">
              Valid until {expiry}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
