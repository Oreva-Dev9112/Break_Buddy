/**
 * Hero banner
 *
 * Welcomes the user and provides a quick CTA. The illustration is intentionally
 * simple; designers can replace the emoji tile with an SVG or Lottie later.
 */
import { motion } from "framer-motion";

interface Props {
  userName: string;
}

export default function HeroBanner({ userName }: Props) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.8
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-r from-[#1a1f3a] to-[#2d3561] rounded-2xl lg:rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div variants={itemVariants} className="z-10 flex-1">
          <motion.p 
            variants={itemVariants}
            className="text-purple-200 mb-2 text-sm md:text-base"
          >
            Good Morning {userName}
          </motion.p>
          <motion.h1 
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
          >
            Check your daily task & Schedules
          </motion.h1>
          
          {/* CTA Button for mobile */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Plan Your Break
          </motion.button>
        </motion.div>
        
        {/* Illustration area */}
        <motion.div 
          variants={illustrationVariants}
          className="hidden md:block relative flex-shrink-0"
        >
          <motion.div 
            whileHover={{ 
              scale: 1.05, 
              rotate: 2,
              transition: { duration: 0.3 }
            }}
            className="w-48 lg:w-64 h-24 lg:h-32 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl flex items-center justify-center text-4xl lg:text-6xl shadow-2xl cursor-pointer"
          >
            <motion.span
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 2 
              }}
            >
              🧳
            </motion.span>
          </motion.div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
          />
          
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full"
          />
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
         animate={{ opacity: 0.1, scale: 1 }}
         transition={{ duration: 1, ease: [0.17, 0.55, 0.55, 1] }}
        className="absolute top-0 right-0 w-64 md:w-96 h-full bg-gradient-to-l from-pink-500/20 to-transparent"
      />
      
      {/* Animated background particles */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-10 right-20 w-2 h-2 bg-purple-400 rounded-full"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1 
        }}
        className="absolute bottom-20 right-32 w-1.5 h-1.5 bg-pink-400 rounded-full"
      />
    </motion.div>
  );
} 