"use client";

import React from "react";
import { motion } from "framer-motion";

interface deatils {
     title:string;
     description:string
}

const OverviewSection: React.FC<deatils> = ({ title, description }) => {
  return (
    <motion.div
      className="bg-teal-600 backdrop-blur-lg rounded-3xl p-6 shadow-xl mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
      <p className="text-lg text-white">{description}</p>
    </motion.div>
  );
};

const Home = () => {
  const overviewData = [
    {
      title: "What is a Hash?",
      description:
        "A hash function converts data into a fixed-length value. In blockchain, hashing ensures data integrity. Even a small change in the input produces a completely different hash, making it secure and tamper-resistant."
    },
    {
      title: "Understanding Block Mining",
      description:
        "Mining is the process of validating transactions and adding them to the blockchain. Miners solve complex mathematical problems to find a 'nonce' that produces a hash meeting certain criteria in our case starting with 0000, securing the network."
    },
    {
      title: "How Blockchain Works",
      description:
        "A blockchain is a decentralized ledger of transactions. Each block contains transaction data, a timestamp, a hash of the previous block, and a unique hash. This creates a chain of blocks, ensuring security and transparency."
    },
    {
      title: "Public and Private Keys",
      description:
        "In cryptography, a public key is shared with others to encrypt messages, while the private key is kept secret for decrypting those messages. Blockchain uses key pairs to sign transactions, ensuring secure identity verification."
    }
  ];

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-black text-center mb-10">
          Blockchain Concepts Overview
        </h1>
        {overviewData.map((item, index) => (
          <OverviewSection key={index} title={item.title} description={item.description} />
        ))}
      </div>
    </div>
  );
};

export default Home;
