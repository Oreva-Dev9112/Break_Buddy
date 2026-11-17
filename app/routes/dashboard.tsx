/**
 * Authenticated dashboard
 *
 * Presents a high-level overview: KPIs, recent activity, tasks, and a calendar.
 * Sends anyone without a local profile back to the landing page.
 *
 * Team notes:
 * - Some panels are still placeholder numbers (e.g., KPIs).
 * - Break plans come from the local store; there is no server to call.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useProfile } from "~/contexts/ProfileContext";
import Sidebar from "~/components/Sidebar";
import TopBar from "~/components/TopBar";
import HeroBanner from "~/components/HeroBanner";
import ActivityChart from "~/components/ActivityChart";
import CalendarWidget from "~/components/CalendarWidget";
import TasksTable from "~/components/TasksTable";
import KpiCard from "~/components/KpiCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { profile, breakPlans, ready } = useProfile();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // No local profile yet: send them back to set one up.
  useEffect(() => {
    if (ready && !profile) {
      navigate("/");
    }
  }, [profile, ready, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgb(50, 46, 58) 0%, rgb(63, 56, 76) 35%, #2d3748 65%, #1a202c 100%)"
        }}
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const userName = profile.full_name;

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onMobileToggle={toggleMobileMenu}
      />
      <main 
        className={`
          transition-all duration-300 ease-in-out min-h-screen px-4 md:px-8 py-6
          ${isMobileMenuOpen ? 'md:ml-20' : 'md:ml-20'}
          ml-0
        `}
        style={{
          background: "linear-gradient(135deg, rgb(50, 46, 58) 0%, rgb(63, 56, 76) 35%, #2d3748 65%, #1a202c 100%)"
        }}
      >
        <TopBar onMobileMenuToggle={toggleMobileMenu} />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-6 md:space-y-8"
        >
          {/* Hero Banner */}
          <motion.div variants={itemVariants}>
            <HeroBanner userName={userName} />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Left Side - Main Content (3/4) */}
            <div className="xl:col-span-3 space-y-6 md:space-y-8">
              {/* KPI Cards Row */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                <KpiCard 
                  icon="🚀" 
                  label="Open Projects" 
                  value="500" 
                  accent="bg-blue-500"
                  delay={0}
                />
                <KpiCard 
                  icon="🏆" 
                  label="Successfully Completed" 
                  value="3502" 
                  accent="bg-green-500"
                  delay={0.1}
                />
                <KpiCard 
                  icon="💰" 
                  label="Earned this month" 
                  value="$15000" 
                  accent="bg-orange-500"
                  delay={0.2}
                />
              </motion.div>

              {/* Activity Chart */}
              <motion.div variants={itemVariants}>
                <ActivityChart />
              </motion.div>

              {/* Tasks Table */}
              <motion.div variants={itemVariants}>
                <TasksTable />
              </motion.div>
            </div>

            {/* Right Side - Calendar & Stats (1/4) */}
            <div className="xl:col-span-1 space-y-6 md:space-y-8">
              <motion.div variants={itemVariants}>
                <CalendarWidget />
              </motion.div>
              
              {/* Quick Profile Card */}
              <motion.div 
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <motion.div 
                    className="flex justify-between"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-purple-200">Breaks Planned</span>
                    <span className="text-white font-medium">{breakPlans.length}</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-purple-200">Work Days</span>
                    <span className="text-white font-medium">{profile.work_days_count}</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-purple-200">Account Type</span>
                    <span className="text-white font-medium capitalize">{profile.user_type}</span>
                  </motion.div>
                </div>
                <motion.button 
                  onClick={() => navigate('/profile')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Edit Profile
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
} 