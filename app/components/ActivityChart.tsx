/**
 * Activity bar chart (lightweight)
 *
 * Small, dependency-free chart using divs + Framer Motion for subtle motion.
 * We favor readability over feature depth; if we need richer charts later,
 * consider swapping to a dedicated charting library behind the same API.
 *
 * Extension ideas:
 * - Accept an input dataset via props and render tooltips with exact values
 * - Add keyboard navigation and ARIA roles for better accessibility
 * - Animate to new values when filters change (spring to new heights)
 */
import { motion } from "framer-motion";

interface Props {
  title?: string;
}

export default function ActivityChart({ title = "Activities" }: Props) {
  // Mock data for the bar chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [60, 45, 75, 55, 95, 85, 65, 40, 70, 50, 90, 80];
  const maxValue = Math.max(...data);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  // Each bar grows to a CSS variable based on its value for clarity
  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: "var(--bar-height)",
      opacity: 1,
      transition: { 
        duration: 0.8
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-semibold text-white"
        >
          {title}
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 md:px-4 py-2 bg-[#1a1f3a] text-white rounded-full text-xs md:text-sm font-medium"
          >
            This Month
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 md:px-4 py-2 bg-white/10 text-purple-200 rounded-full text-xs md:text-sm"
          >
            This Week
          </motion.button>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-between h-48 md:h-64 gap-2 md:gap-4 overflow-x-auto"
      >
        {months.map((month, index) => (
          <motion.div 
            key={month} 
            variants={barVariants}
            className="flex flex-col items-center gap-2 flex-1 min-w-[30px]"
          >
            <div className="relative flex flex-col items-center h-40 md:h-48">
              {/* Bar */}
              <motion.div 
                className="w-6 md:w-8 bg-gradient-to-t from-pink-400 to-orange-400 rounded-t-lg"
                style={{ 
                  "--bar-height": `${(data[index] / maxValue) * 100}%`,
                  height: "var(--bar-height)"
                } as React.CSSProperties}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              />
              {/* Dot indicator */}
              <motion.div 
                className="w-2 md:w-3 h-2 md:h-3 bg-pink-400 rounded-full mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.3 }}
              />
            </div>
            {/* Month label */}
            <motion.span 
              className="text-purple-200 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.05 }}
            >
              {month}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {/* Y-axis labels */}
      <motion.div 
        className="flex justify-between text-purple-200 text-xs mt-4 px-2 md:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>0</span>
        <span>30</span>
        <span>50</span>
        <span>70</span>
        <span>100</span>
      </motion.div>
    </motion.div>
  );
} 