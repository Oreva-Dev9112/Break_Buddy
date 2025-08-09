/**
 * Top navigation bar
 *
 * Renders a compact search, the current date, notifications, and a user chip.
 * Adjusts for mobile by hiding the search button and exposing a hamburger.
 *
 * Team note: When we wire real search, debounce the input and use loaders or
 * resource routes to stream results.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const [today, setToday] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const now = new Date();
    const opts: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    };
    setToday(now.toLocaleDateString(undefined, opts));

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex items-center justify-between mb-8 px-2"
    >
      {/* Left side - Mobile menu + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </motion.button>
        )}

        {/* Search */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 flex-1"
        >
          <div className="relative flex-1">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder={isMobile ? "Search" : "Search destinations, trips..."}
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/15 transition-all duration-200"
            />
            <motion.div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300"
              whileHover={{ scale: 1.1 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </motion.div>
          </div>
          
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Search
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Right side - Date + User controls */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center gap-4"
      >
        {/* Date */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-purple-200 text-sm"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            📅
          </motion.span>
          <span className="font-medium">{today}</span>
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {/* Notification badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          />
        </motion.button>

        {/* User avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-lg"
        >
          U
        </motion.div>
      </motion.div>
    </motion.header>
  );
} 