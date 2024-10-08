"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Blockchain Concepts</h1>
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <nav className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:block md:space-x-4 absolute md:static left-0 right-0 top-16 md:top-auto bg-purple-500 md:bg-transparent p-4 md:p-0`}>
            <Link href="/hash" className="block md:inline-block text-white hover:bg-purple-600 md:hover:bg-white md:hover:text-purple-500 px-4 py-2 rounded-lg transition duration-300 mb-2 md:mb-0">Hash</Link>
            <Link href="/block" className="block md:inline-block text-white hover:bg-purple-600 md:hover:bg-white md:hover:text-purple-500 px-4 py-2 rounded-lg transition duration-300 mb-2 md:mb-0">Block</Link>
            <Link href="/blockchain" className="block md:inline-block text-white hover:bg-purple-600 md:hover:bg-white md:hover:text-purple-500 px-4 py-2 rounded-lg transition duration-300 mb-2 md:mb-0">Blockchain</Link>
            <Link href="/keys" className="block md:inline-block text-white hover:bg-purple-600 md:hover:bg-white md:hover:text-purple-500 px-4 py-2 rounded-lg transition duration-300">Public/Private Keys</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;