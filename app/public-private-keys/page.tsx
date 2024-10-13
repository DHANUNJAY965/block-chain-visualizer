"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";

export default function KeyGeneration() {
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const initialBgColor = "bg-teal-600";
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const fetchPublicKey = async () => {
      if (privateKey) {
        setLoading(true);
        setBgColor("bg-red-300");
        setIsBlinking(true);
        try {
          const response = await fetch('/api/getPublicKey', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ privateKey }),
          });
          const data = await response.json();
          setPublicKey(data.publicKey);
          setBgColor("bg-teal-600");
        } catch (error) {
          console.error('Error fetching public key:', error);
          setPublicKey("Error generating public key");
        } finally {
          setLoading(false);
          setIsBlinking(false);
        }
      } else {
        setPublicKey('');
      }
    };

    fetchPublicKey();
  }, [privateKey]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const generateRandomPrivateKey = () => {
    const randomKey = Math.floor(Math.random() * 1e18);
    setPrivateKey(randomKey.toString());
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPrivateKey(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-black text-center mb-5">
            Public/Private Key Generation
          </h1>
          <motion.div
            className={`${bgColor} backdrop-blur-lg rounded-3xl p-6 shadow-xl`}
            animate={{ opacity: isBlinking ? [1, 0.5, 1] : 1 }}
            transition={{ repeat: isBlinking ? Infinity : 0, duration: 3 }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-lg sm:text-xl font-semibold text-white mb-2">
                  Private Key (Numeric)
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={privateKey}
                    onChange={handlePrivateKeyChange}
                    className="flex-grow px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter private key (numeric)"
                  />
                  <button
                    onClick={generateRandomPrivateKey}
                    className="px-4 py-2 rounded-xl font-medium bg-yellow-500 text-black border-2 border-black hover:bg-yellow-600 transition-all"
                  >
                    Random
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-lg sm:text-xl font-semibold text-white">
                    Public Key (Hex)
                  </label>
                  {publicKey && (
                    <button
                      onClick={copyToClipboard}
                      className="text-white hover:text-gray-200 transition-colors"
                      type="button"
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </button>
                  )}
                </div>
                <div className="relative group overflow-x-auto">
                  <input
                    type="text"
                    value={loading ? "Fetching public key..." : (publicKey || "Public key will appear here...")}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 whitespace-nowrap overflow-x-auto"
                    style={{ minWidth: '100%' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}