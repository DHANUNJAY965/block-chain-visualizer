"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
// import { Copy, CheckCircle2 } from "lucide-react";

const firstprev = "0000000000000000000000000000000000000000";
type Block = {
  number: number;
  nonce: string;
  data: string;
  hash: string;
  prevHash: string;
  isMined: boolean;
  isBlinking: boolean;
};

const HashBlock = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      number: 1,
      nonce: "89565",
      data: "",
      hash: "0000",
      prevHash: `${firstprev}`,
      isMined: false,
      isBlinking: false,
    },
    {
      number: 2,
      nonce: "89565",
      data: "",
      hash: "0000",
      prevHash: "",
      isMined: false,
      isBlinking: false,
    },
    {
      number: 3,
      nonce: "89565",
      data: "",
      hash: "0000",
      prevHash: "",
      isMined: false,
      isBlinking: false,
    },
    {
      number: 4,
      nonce: "89565",
      data: "",
      hash: "0000",
      prevHash: "",
      isMined: false,
      isBlinking: false,
    },
    {
      number: 5,
      nonce: "89565",
      data: "",
      hash: "0000",
      prevHash: "",
      isMined: false,
      isBlinking: false,
    },
    {
      number: 6,
      nonce: "89565",
      data: "",
      hash: "0000",
      prevHash: "",
      isMined: false,
      isBlinking: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hashing, setHashing] = useState(false);

  // Function to generate hash based on number, nonce, data, and previous hash
  const generateHash = async (blockIndex: number) => {
    const { number, nonce, data, prevHash } = blocks[blockIndex];

    try {
      const res = await axios.post("/api/hash", {
        input: number + nonce + data + prevHash,
        encoding: "Hex",
      });

      const hashValue = res.data.hash || "No hash generated";
      const updatedBlocks = [...blocks];
      updatedBlocks[blockIndex].hash = hashValue;

      // Check if mined
      const isMined = hashValue.startsWith("0000");
      updatedBlocks[blockIndex].isMined = isMined;
      updatedBlocks[blockIndex].isBlinking = !isMined;

      // If blockIndex is not the last block, update the next block's prevHash
      if (blockIndex < blocks.length - 1) {
        updatedBlocks[blockIndex + 1].prevHash = hashValue;

        // Call generateHash for the next block
        await generateHash(blockIndex + 1);
      }

      // If the hash does not start with "0000", make all subsequent blocks blink red
      if (!isMined) {
        for (let i = blockIndex + 1; i < updatedBlocks.length; i++) {
          updatedBlocks[i].isBlinking = true;
          updatedBlocks[i].isMined = false; // Ensure they're marked as not mined
        }
      }

      setBlocks(updatedBlocks);
    } catch (error) {
      console.error("Error:", error);
      setBlocks((prevBlocks) => {
        const updated = [...prevBlocks];
        updated[blockIndex].hash = "Error generating hash";
        return updated;
      });
    }
  };

  // Automatically generate hash when number, nonce, data, or prevHash changes
  const handleInputChange = (
    index: number,
    field: keyof Block,
    value: string
  ) => {
    const updated = [...blocks];

    // Using conditional assignment to ensure correct type for each field
    switch (field) {
      case "number":
        updated[index][field] = parseInt(value, 10);
        break;
      case "nonce":
      case "data":
      case "hash":
      case "prevHash":
        updated[index][field] = value;
        break;
      default:
      // Handle unexpected field names
    }

    setBlocks(updated);

    // Generate hash for the current block and subsequent blocks
    if (!hashing) {
      setHashing(true);
      generateHash(index).finally(() => setHashing(false));
    }
  };

  const copyToClipboard = async (blockIndex: number) => {
    try {
      await navigator.clipboard.writeText(blocks[blockIndex].hash);
      setCopied(true);
      console.log(copied);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Mine function to send a request to /mine
  const mineBlock = async (blockIndex: number) => {
    setLoading(true);
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].isBlinking = true;
    setBlocks(updatedBlocks);

    try {
      const res = await axios.post("/api/hash", {
        input:
          blocks[blockIndex].data +
          blocks[blockIndex].number +
          blocks[blockIndex].nonce +
          blocks[blockIndex].prevHash,
        encoding: "Hex",
        mine: true,
      });

      const { hash: minedHash, nonce: newNonce } = res.data;

      if (minedHash.startsWith("0000")) {
        updatedBlocks[blockIndex].hash = minedHash;
        updatedBlocks[blockIndex].nonce = newNonce;
        updatedBlocks[blockIndex].isMined = true;
        updatedBlocks[blockIndex].isBlinking = false;

        // Update subsequent blocks
        for (let i = blockIndex + 1; i < updatedBlocks.length; i++) {
          updatedBlocks[i].prevHash = updatedBlocks[i - 1].hash;
          await generateHash(i);
        }
      } else {
        updatedBlocks[blockIndex].isMined = false;
        updatedBlocks[blockIndex].isBlinking = true;
      }

      setBlocks(updatedBlocks);
    } catch (error) {
      console.error("Error mining block:", error);
      setBlocks((prevBlocks) => {
        const updated = [...prevBlocks];
        updated[blockIndex].hash = "Error mining block";
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically mine the first block on component mount
  useEffect(() => {
    const mineInitialBlocks = async () => {
      for (let i = 0; i < blocks.length; i++) {
        await mineBlock(i);
      }
    };

    mineInitialBlocks();
  }, []);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-black text-center mb-4">
        BlockChain
      </h1>
      <div className="flex overflow-auto flex-col md:flex-row md:space-x-4">
        {blocks.map((block, index) => (
          <motion.div
            key={index}
            className={`${
              block.isBlinking ? "bg-red-300" : "bg-teal-600"
            } backdrop-blur-lg rounded-3xl p-6 shadow-xl mb-4 md:mb-0 md:w-96 flex-shrink-0`}
            animate={{ opacity: block.isBlinking ? [1, 0.5, 1] : 1 }}
            transition={{
              repeat: block.isBlinking ? Infinity : 0,
              duration: 3,
            }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Block Number
                </label>
                <input
                  type="number"
                  className="w-full bg-white text-black rounded-xl px-3 py-2 focus:outline-none"
                  value={block.number}
                  onChange={(e) => handleInputChange(index, "number", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Nonce
                </label>
                <input
                  type="text"
                  className="w-full bg-white text-black rounded-xl px-3 py-2 focus:outline-none"
                  value={block.nonce}
                  onChange={(e) =>
                    handleInputChange(index, "nonce", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Data
                </label>
                <input
                  type="text"
                  className="w-full bg-white text-black rounded-xl px-3 py-2 focus:outline-none"
                  value={block.data}
                  onChange={(e) =>
                    handleInputChange(index, "data", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Previous Hash
                </label>
                <input
                  type="text"
                  className="w-full bg-white text-black rounded-xl px-3 py-2 focus:outline-none cursor-not-allowed"
                  value={block.prevHash}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl font-semibold text-white mb-2">
                  Hash
                </label>
                <input
                  type="text"
                  className="w-full bg-white text-black rounded-xl px-3 py-2 focus:outline-none cursor-not-allowed"
                  value={block.hash}
                  readOnly
                  onFocus={() => copyToClipboard(index)}
                  style={{
                    backgroundColor:
                      block.hash && !block.hash.startsWith("0000")
                        ? "rgba(255, 0, 0, 0.2)"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                />
              </div>

              <button
                onClick={() => mineBlock(index)}
                className={`w-full py-3 rounded-xl text-white font-bold ${
                  block.isMined
                    ? "bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600 transition-all"
                }`}
                disabled={block.isMined || loading}
              >
                {loading ? "Mining..." : "Mine Block"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HashBlock;
