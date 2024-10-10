"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Copy, CheckCircle2 } from "lucide-react";

export default function HashPage() {
  const initialInput = ""; 
  const [inputValue, setInputValue] = useState(initialInput);
  const [encodingType, setEncodingType] = useState("Hex");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(true); 
  const [copied, setCopied] = useState(false);

  const encodingTypes = ["Ascii", "Hex", "Base64", "Base58"];

  useEffect(() => {
    const generateHash = async () => {
      if (!inputValue) {
        setHash("");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.post("/api/hash", {
          input: inputValue,
          encoding: encodingType
        }, {
          headers: { "Content-Type": "application/json" }
        });

        setHash(res.data.hash || "No hash generated");
      } catch (error) {
        console.error("Error:", error);
        setHash("Error generating hash");
      } finally {
        setLoading(false);
      }
    };

    generateHash(); 
  }, [inputValue, encodingType]); 

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      console.log(loading);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="max-w-md mx-auto ">
          <h1 className="text-4xl font-bold  text-black text-center mb-8">
          SHA256 Hash
          </h1>
          <div className="bg-teal-600 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Enter a Value
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Type something..."
                />
              </div>

              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Select Encoding Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {encodingTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setEncodingType(type)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        encodingType === type
                          ? "bg-yellow-500 text-black border-2 border-black"
                          : "bg-white/50 text-gray-800 hover:bg-white/60"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xl font-semibold text-white">
                    Hash Value of Given Input
                  </label>
                  {hash && (
                    <button
                      onClick={copyToClipboard}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </button>
                  )}
                </div>
                <div className="bg-white/50 rounded-xl p-4 min-h-[60px]">
                  <p className="font-mono text-gray-800 break-all">
                    {hash || "Hash will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
