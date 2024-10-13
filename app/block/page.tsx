"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";

export default function HashBlock() {
  const [number, setNumber] = useState(1);
  const [nonce, setNonce] = useState("89565");
  const [data, setData] = useState("");
  const [hash, setHash] = useState("0000");
  const [loading, setLoading] = useState(false);
  const [mined, setMined] = useState(false);
  const [copied, setCopied] = useState(false);

  const initialBgColor = "bg-teal-600";
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [isBlinking, setIsBlinking] = useState(false);

  // Function to generate hash based on number, nonce, and data
  const generateHash = async () => {
    try {
      const res = await axios.post("/api/hash", {
        input: number + nonce + data,
        encoding: "Hex",
      });

      const hashValue = res.data.hash || "No hash generated";
      setHash(hashValue);

      if (hashValue.startsWith("0000")) {
        setBgColor("bg-teal-600");
        setMined(true);
        setIsBlinking(false);
      } else {
        setBgColor("bg-red-300");
        setMined(false);
        setIsBlinking(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setHash("Error generating hash");
    }
  };

  // Automatically generate hash when number, nonce, or data changes
  useEffect(() => {
    if ((number !== 1 || nonce !== "89565" || data !== "") && mined === false) {
      generateHash();
    }
  }, [number, nonce, data]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Mine function to send a request to /mine
  const mineBlock = async () => {
    setLoading(true);
    setBgColor("bg-red-300");
    setIsBlinking(true);
    try {
      const res = await axios.post("/api/hash", {
        input: data + number + nonce,
        encoding: "Hex",
        mine: true,
      });

      const { hash: minedHash, nonce: newNonce } = res.data;

      if (minedHash.startsWith("0000")) {
        setBgColor("bg-teal-600");
        setMined(true);
        setHash(minedHash);
        setNonce(newNonce);
        setIsBlinking(false);
      } else {
        setBgColor("bg-red-300");
        setMined(false);
        setIsBlinking(true);
      }
    } catch (error) {
      console.error("Error mining block:", error);
      setHash("Error mining block");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <div className="max-w-md mx-auto ">
          <h1 className="text-4xl font-bold text-black text-center mb-5">
            Block Mining
          </h1>
          <motion.div
            className={`${bgColor} backdrop-blur-lg rounded-3xl p-6 shadow-xl`}
            animate={{ opacity: isBlinking ? [1, 0.5, 1] : 1 }}
            transition={{ repeat: isBlinking ? Infinity : 0, duration: 3 }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Block Number
                </label>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => {
                    setMined(false);
                    setNumber(parseInt(e.target.value, 10));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Block number"
                />
              </div>

              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Nonce
                </label>
                <input
                  type="text"
                  value={nonce}
                  onChange={(e) => {
                    setMined(false);
                    setNonce(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Nonce"
                />
              </div>

              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Data
                </label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => {
                    setMined(false);
                    setData(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Type your data here"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xl font-semibold text-white">
                    Hash
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
                <div className="relative group">
                  <input
                    type="text"
                    value={hash || "Hash will appear here..."}
                    disabled
                    className="w-full bg-white/50 rounded-xl p-4 font-mono text-gray-800 border border-white/30 cursor-not-allowed focus:outline-none overflow-hidden whitespace-nowrap text-ellipsis"
                    title={hash} 
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={mineBlock}
                  className="px-4 py-2 rounded-xl font-medium bg-yellow-500 text-black border-2 border-black hover:bg-yellow-600 transition-all"
                >
                  {loading ? "Mining..." : "Mine"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


