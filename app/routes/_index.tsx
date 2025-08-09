/**
 * Public landing page
 *
 * Animated carousel with Lottie scenes that gently promotes taking breaks.
 * The page offers two paths into the app (individual vs corporate) via /login.
 *
 * Team notes:
 * - To add more slides, just append to the `slides` array.
 * - We keep the carousel logic small and predictable (timeout + drag gestures).
 */
import { useState, useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "@remix-run/react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

const slides = [
  {
    url: "https://lottie.host/5fc2b696-dbcf-45da-ac5f-3b182af12d56/BP8sPfCIYW.lottie",
    caption: "Take your first break. Recharge!"
  },
  {
    url: "https://lottie.host/0b7b99e4-fbe7-49a8-9e5d-daa58de7265d/IFSUKtEQNQ.lottie",
    caption: "Invite a buddy to rest together."
  },
  {
    url: "https://lottie.host/aaf4fce9-4d54-4325-9939-ebe0d9322df9/CPsdiKD4GC.lottie",
    caption: "Celebrate your progress with badges!"
  }
];

export default function Index() {
  console.log('🏠 Landing page component loading...')
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide the carousel every 5 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeIndex]);

  // Swipe handler (Framer Motion drag) for previous/next navigation
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      // Swipe left (next)
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % slides.length);
    } else if (info.offset.x > 100) {
      // Swipe right (previous)
      setDirection(-1);
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between px-4 py-8"
      style={{
        background: "linear-gradient(135deg, rgb(50, 46, 58) 0%, rgb(63, 56, 76) 35%, #2d3748 65%, #1a202c 100%)"
      }}
    >
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        {/* Animated Carousel */}
        <div className="mb-8 flex justify-center items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div
            className="relative w-full"
            style={{
              aspectRatio: "1 / 1",
              maxHeight: "400px"
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ touchAction: "pan-y" }}
              >
                <DotLottieReact
                  src={slides[activeIndex].url}
                  loop
                  autoplay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Content Section */}
        <div className="text-center space-y-4 mb-8">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Welcome to Break Buddy
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Plan your next meaningful break
          </p>

          {/* Slide caption (animated) */}
          <div className="min-h-[2rem] flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-sm sm:text-base text-gray-300 italic"
              >
                {slides[activeIndex].caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination bullets */}
        <div className="flex gap-3 justify-center items-center mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border-2 ${
                i === activeIndex
                  ? "bg-purple-400 border-purple-400 scale-125 shadow-lg shadow-purple-400/50"
                  : "bg-transparent border-gray-500 hover:border-gray-400"
              }`}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1);
                setActiveIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full flex justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl w-full max-w-sm mx-4 flex rounded-3xl p-2 justify-between items-center gap-2">
          <Link
            to="/login?type=individual"
            className="flex-1 flex flex-col items-center text-white px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:shadow-lg transform hover:scale-105 group"
          >
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-full mb-2 group-hover:from-purple-300 group-hover:to-pink-400 transition-all duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="1"/>
                <path d="m9 20 3-6 3 6"/>
                <path d="m6 8 6 2 6-2"/>
                <path d="M12 10v4"/>
              </svg>
            </div>
            <span className="font-semibold text-sm">Individual</span>
          </Link>
          
          <Link
            to="/login?type=corporate"
            className="flex-1 flex flex-col items-center text-white px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:shadow-lg transform hover:scale-105 group"
          >
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-3 rounded-full mb-2 group-hover:from-blue-300 group-hover:to-cyan-400 transition-all duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                <path d="M10 6h4"/>
                <path d="M10 10h4"/>
                <path d="M10 14h4"/>
                <path d="M10 18h4"/>
              </svg>
            </div>
            <span className="font-semibold text-sm">Corporate</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
