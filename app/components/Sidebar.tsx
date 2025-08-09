/**
 * Responsive sidebar navigation
 *
 * Collapses to a mobile drawer on small screens. Uses route pathname matching to
 * highlight the active section. Keep iconography simple (emojis for now) while
 * we finalize the design system.
 */
import { Link, useLocation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { icon: "🏠", path: "/dashboard", label: "Dashboard" },
  { icon: "📅", path: "/calendar", label: "Calendar" },
  { icon: "🗺️", path: "/trips", label: "Trips" },
  { icon: "💬", path: "/messages", label: "Messages" },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onMobileToggle }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarVariants = {
    hidden: { x: -80, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={onMobileToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className={`
          fixed left-0 top-0 h-screen bg-[#121433] flex flex-col items-center py-6 space-y-6 z-40 shadow-2xl
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}` 
            : 'w-20'
          }
        `}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMobileToggle}
            className="self-end mr-4 text-white/70 hover:text-white text-xl"
          >
            ✕
          </motion.button>
        )}

        {/* Avatar */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer"
        >
          BB
        </motion.div>

        {/* Navigation */}
        <nav className={`flex flex-col gap-4 mt-8 ${isMobile ? 'px-4 w-full' : ''}`}>
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              variants={itemVariants}
              custom={index}
            >
              <Link
                to={item.path}
                className={`
                  flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                  ${location.pathname.startsWith(item.path) 
                    ? "bg-pink-500/20 text-pink-400 shadow-lg" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                  ${isMobile ? 'w-full justify-start' : 'justify-center'}
                `}
              >
                <motion.span 
                  className="text-2xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.icon}
                </motion.span>
                {isMobile && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Settings */}
        <motion.div variants={itemVariants}>
          <Link 
            to="/settings" 
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10
              ${isMobile ? 'w-full justify-start px-4' : 'justify-center'}
            `}
          >
            <motion.span 
              className="text-xl"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ⚙️
            </motion.span>
            {isMobile && <span className="font-medium">Settings</span>}
          </Link>
        </motion.div>

        {/* Logout */}
        <motion.div variants={itemVariants}>
          <Link 
            to="/" 
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-white/70 hover:text-red-400 hover:bg-red-500/10
              ${isMobile ? 'w-full justify-start px-4' : 'justify-center'}
            `}
          >
            <motion.span 
              className="text-xl"
              whileHover={{ scale: 1.2, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              ↩️
            </motion.span>
            {isMobile && <span className="font-medium">Logout</span>}
          </Link>
        </motion.div>

        <motion.span 
          variants={itemVariants}
          className="text-white/30 text-[10px] mt-4"
        >
          v1.0
        </motion.span>
      </motion.aside>
    </>
  );
} 