"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = ['Hash', 'Block', 'Blockchain', 'public-private-keys'];

  const isActive = (path:string) => {
    return pathname === `/${path.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 w-full bg-teal-600 py-6 shadow-xl z-30"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Blockchain Concepts</h1>
            </Link>
            
            <button
              className="md:hidden text-white z-50 relative"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {!isMobile && (
              <nav className="hidden md:block md:space-x-4">
                {menuItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className={`inline-block px-4 py-2 rounded-xl transition duration-300 text-xl
                      ${isActive(item) 
                        ? 'bg-white !text-teal-600 font-bold' 
                        : 'hover:bg-teal-500 text-white'      
                      }`}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-teal-600 z-40 pt-24 px-4 overflow-y-auto"
          >
            <div className="absolute top-6 right-4 md:hidden">
              <button
                className="text-white"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className={`block text-white px-4 py-4 rounded-xl transition duration-300 text-xl mb-2
                  ${isActive(item) 
                    ? 'bg-white !text-teal-600 font-bold' 
                    : 'hover:bg-teal-500'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="pt-24">
        
      </div>
    </>
  );
}

export default Header;

