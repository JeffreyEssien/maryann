import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

interface MemoryLaneProps {
    onComplete: () => void;
}

const memories = [
    {
        id: 1,
        title: "The Times You Smiled at Me",
        text: "I remember the moment so clearly... my heart skipped a beat.",
        date: "Where it all began",
        video: "/3EA25306-8055-452F-8448-7EEDBFFEBF3F.MP4"
    },
    {
        id: 2,
        title: "Our Long Conversations",
        text: "Hours felt like minutes when I was talking with you. Literally",
        date: "Every word mattered",
        video: "/AD7218D0-C8CB-425E-B18D-5F0CAD6C48B7.MP4"
    },
    {
        id: 3,
        title: "The Quiet Comfort",
        text: "Sometimes we didn't need words. Just being near you was enough.",
        date: "Peaceful moments",
        video: "/DF528676-2204-4055-8015-81BE9C39BAAB.MP4"
    },
    {
        id: 4,
        title: "The Moment I Knew",
        text: "That's when I realized... you were the one I'd been waiting for.",
        date: "Everything changed",
        img: "/IMG_2820.JPG"
    }
];

// Generate slow twinkling stars (sparse)
const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 4,
    }));
};

const MemoryLane: React.FC<MemoryLaneProps> = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const stars = useMemo(() => generateStars(25), []);

    const nextMemory = () => {
        if (currentIndex < memories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Dissolve into light and transition
            setIsExiting(true);
            setTimeout(() => onComplete(), 2000);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextMemory();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    return (
        <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isExiting ? 2 : 1.5 }}
        >
            {/* Lavender-rose gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #1a1520 0%, #201828 25%, #2a1f30 50%, #1e1825 75%, #151218 100%)',
                }}
            />

            {/* Soft gradient overlays */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 30% 30%, rgba(180, 140, 180, 0.06) 0%, transparent 50%)',
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 70% 70%, rgba(200, 150, 170, 0.05) 0%, transparent 50%)',
                }}
            />

            {/* Film grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Slow twinkling stars */}
            {stars.map((star) => (
                <motion.div
                    key={`star-${star.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        background: '#fff8f0',
                        boxShadow: '0 0 4px rgba(255, 248, 240, 0.6)',
                    }}
                    animate={{
                        opacity: [0.1, 0.6, 0.1],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Exit flash (dissolve into light) */}
            <motion.div
                className="absolute inset-0 bg-ivory pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExiting ? 1 : 0 }}
                transition={{ duration: 1.5 }}
            />

            {/* Background media (blurred, parallax) */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={memories[currentIndex].video || memories[currentIndex].img}
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                >
                    {memories[currentIndex].video ? (
                        <video
                            src={memories[currentIndex].video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: 'blur(12px) saturate(0.6) sepia(0.1)' }}
                        />
                    ) : (
                        <img
                            src={memories[currentIndex].img}
                            alt="Memory"
                            className="w-full h-full object-cover"
                            style={{ filter: 'blur(12px) saturate(0.6) sepia(0.1)' }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151218] via-[#151218]/60 to-[#151218]/40" />
                </motion.div>
            </AnimatePresence>

            {/* Main content */}
            <div className="z-10 max-w-2xl px-6 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, y: -25, filter: 'blur(8px)', scale: 1.02 }}
                        transition={{
                            duration: 1,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            opacity: { duration: 0.8 },
                            filter: { duration: 1.2 },
                            scale: { type: 'spring', damping: 25, stiffness: 120 },
                        }}
                    >
                        {/* Photo frame */}
                        <motion.div
                            className="relative mx-auto mb-8 w-[240px] h-[160px] md:w-[320px] md:h-[200px]"
                            initial={{ y: 30, rotateX: 10 }}
                            animate={{ y: 0, rotateX: 0 }}
                            transition={{ duration: 1 }}
                            style={{ perspective: 1000 }}
                        >
                            {/* Frame border */}
                            <div
                                className="absolute inset-0 rounded-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #d4c4a8 0%, #bfaf94 50%, #c9b99d 100%)',
                                    padding: '8px',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                                }}
                            >
                                {/* Inner frame */}
                                <div
                                    className="absolute inset-2 rounded-sm overflow-hidden"
                                    style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}
                                >
                                    {memories[currentIndex].video ? (
                                        <video
                                            src={memories[currentIndex].video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover"
                                            style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                                        />
                                    ) : (
                                        <img
                                            src={memories[currentIndex].img}
                                            alt={memories[currentIndex].title}
                                            className="w-full h-full object-cover"
                                            style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Handwritten date label */}
                            <motion.div
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#f5f0e6] rounded-sm shadow-md"
                                style={{
                                    fontFamily: "'Satisfy', cursive, serif",
                                    transform: 'translateX(-50%) rotate(-2deg)',
                                }}
                            >
                                <span className="text-sm text-stone-600 italic">{memories[currentIndex].date}</span>
                            </motion.div>
                        </motion.div>

                        {/* Title with warm glow */}
                        <motion.h2
                            className="text-2xl md:text-4xl mb-4 tracking-wide"
                            style={{
                                fontFamily: "'Alex Brush', cursive",
                                background: 'linear-gradient(90deg, #e8c4b8, #d4af37, #e8c4b8)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
                            }}
                            animate={{ backgroundPosition: ['0% center', '200% center'] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        >
                            {memories[currentIndex].title}
                        </motion.h2>

                        {/* Quote */}
                        <motion.p
                            className="text-lg md:text-2xl font-serif text-ivory/85 leading-relaxed mb-10 italic"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                textShadow: '0 0 20px rgba(180, 140, 180, 0.15)',
                            }}
                        >
                            "{memories[currentIndex].text}"
                        </motion.p>
                    </motion.div>
                </AnimatePresence>

                {/* Minimal Next button */}
                <motion.button
                    onClick={nextMemory}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-8 py-3 rounded-full font-serif text-ivory/80 transition-all duration-300"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        background: 'rgba(255, 248, 240, 0.08)',
                        border: '1px solid rgba(255, 248, 240, 0.2)',
                    }}
                >
                    <span className="flex items-center gap-2 text-base md:text-lg">
                        {currentIndex === memories.length - 1 ? (
                            <>
                                Continue <Heart size={14} className="text-rose-300/70" fill="currentColor" />
                            </>
                        ) : (
                            <>
                                Next Memory <ChevronRight size={16} className="text-ivory/60" />
                            </>
                        )}
                    </span>
                </motion.button>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                {memories.map((_, idx) => (
                    <motion.div
                        key={idx}
                        className="h-1 rounded-full transition-all duration-500"
                        animate={{
                            width: idx === currentIndex ? 28 : 6,
                            backgroundColor: idx === currentIndex ? 'rgba(212, 175, 55, 0.7)' : 'rgba(255, 248, 240, 0.2)',
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default MemoryLane;
