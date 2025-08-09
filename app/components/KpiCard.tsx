/**
 * KPI metric card
 *
 * Displays a labeled value with a small accent tile. Animations are subtle to
 * avoid distracting from content. Props stay generic so the card is reusable.
 */
import { motion } from "framer-motion";

interface Props {
  icon: string;
  label: string;
  value: string | number;
  accent?: string; // e.g. bg-green-500
  delay?: number;
}

export default function KpiCard({ icon, label, value, accent = "bg-purple-500", delay = 0 }: Props) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, delay }
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 hover:bg-white/15"
    >
      <motion.div 
        className={`${accent} p-2 md:p-3 rounded-xl text-base md:text-lg shadow-lg`}
        whileHover={{ 
          scale: 1.1, 
          rotate: 10,
          transition: { duration: 0.2 }
        }}
      >
        <motion.span
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {icon}
        </motion.span>
      </motion.div>
      <div className="flex-1 min-w-0">
        <motion.p 
          className="text-xs md:text-sm text-purple-200 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {label}
        </motion.p>
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl font-bold text-white truncate"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: delay + 0.3,
            type: "spring",
            stiffness: 100
          }}
        >
          {value}
        </motion.p>
      </div>
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
} 