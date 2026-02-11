import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';

import { useEmail } from '../hooks/useEmail';

// Generate floating sparkles
const generateSparkles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 3,
    }));
};

// Generate floating hearts
const generateHearts = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 12 + Math.random() * 14,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.2,
    }));
};

const Proposal: React.FC = () => {
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const [isAccepted, setIsAccepted] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const { sendProposalConfirmation } = useEmail();

    const sparkles = useMemo(() => generateSparkles(20), []);
    const hearts = useMemo(() => generateHearts(10), []);
    const celebrationHearts = useMemo(() => generateHearts(18), []);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleNoHover = () => {
        // Smaller movement for mobile
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 150;
        setNoBtnPosition({ x, y });
    };

    const handleYes = () => {
        setIsAccepted(true);

        // Send confirmation email
        sendProposalConfirmation();

        // Elegant confetti
        const colors = ['#e8b4b8', '#d4af37', '#f8e8e8', '#c9a0dc'];

        // Center burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 },
            colors: colors,
            startVelocity: 40,
            ticks: 200,
            gravity: 0.8,
        });

        // Gentle side bursts
        setTimeout(() => {
            confetti({
                particleCount: 40,
                angle: 60,
                spread: 50,
                origin: { x: 0, y: 0.7 },
                colors: colors,
            });
            confetti({
                particleCount: 40,
                angle: 120,
                spread: 50,
                origin: { x: 1, y: 0.7 },
                colors: colors,
            });
        }, 200);
    };

    // ========== CELEBRATION SCREEN ==========
    if (isAccepted) {
        return (
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Soft blush gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #2d1f2a 0%, #1f1520 50%, #1a1218 100%)',
                    }}
                />

                {/* Warm glow */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at 50% 40%, rgba(232, 180, 184, 0.12) 0%, transparent 50%)',
                    }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Floating hearts */}
                {celebrationHearts.map((heart) => (
                    <motion.div
                        key={`cel-heart-${heart.id}`}
                        className="absolute pointer-events-none"
                        style={{ left: `${heart.x}%`, bottom: '-10%' }}
                        animate={{
                            y: [0, -window.innerHeight * 1.3],
                            x: [0, Math.sin(heart.id) * 30, 0],
                            rotate: [0, 360],
                            opacity: [0, heart.opacity + 0.2, 0],
                        }}
                        transition={{
                            duration: heart.duration,
                            delay: heart.delay * 0.5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <Heart
                            size={heart.size}
                            fill={heart.id % 3 === 0 ? '#e8b4b8' : heart.id % 3 === 1 ? '#d4af37' : '#c9a0dc'}
                            stroke="none"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(232, 180, 184, 0.4))' }}
                        />
                    </motion.div>
                ))}

                {/* Main content */}
                <motion.div
                    className="relative z-10 text-center max-w-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                    {/* Pulsing heart */}
                    <motion.div
                        className="mb-6"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Heart
                            size={56}
                            fill="#e8b4b8"
                            stroke="none"
                            className="mx-auto"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(232, 180, 184, 0.6))' }}
                        />
                    </motion.div>

                    <motion.h1
                        className="text-3xl md:text-5xl text-white leading-snug mb-4"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic' }}
                    >
                        Yay!!!<br />
                    </motion.h1>

                    <motion.p
                        className="text-2xl md:text-3xl text-white/90 leading-relaxed"
                        style={{ fontFamily: "'Alex Brush', cursive" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        I'm so happy you said yes, <span className="text-rose-200">Maryann</span>
                    </motion.p>

                    {/* Bouncing hearts row */}
                    <motion.div
                        className="mt-8 flex justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Heart
                                    size={12 + i * 2}
                                    fill={i % 2 === 0 ? '#e8b4b8' : '#d4af37'}
                                    stroke="none"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    // ========== PROPOSAL SCREEN ==========
    return (
        <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* Elegant gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(150deg, #1f1a1c 0%, #1a1520 40%, #15121a 100%)',
                }}
            />

            {/* Soft ambient glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 35%, rgba(232, 180, 184, 0.08) 0%, transparent 45%)',
                }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating sparkles */}
            {sparkles.map((sparkle) => (
                <motion.div
                    key={`sparkle-${sparkle.id}`}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                    }}
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.8, 0],
                        rotate: [0, 180],
                    }}
                    transition={{
                        duration: sparkle.duration,
                        delay: sparkle.delay,
                        repeat: Infinity,
                    }}
                >
                    <Sparkles size={sparkle.size} className="text-rose-200/50" />
                </motion.div>
            ))}

            {/* Floating hearts (gentle) */}
            {hearts.map((heart) => (
                <motion.div
                    key={`heart-${heart.id}`}
                    className="absolute pointer-events-none"
                    style={{ left: `${heart.x}%`, bottom: '-8%' }}
                    animate={{
                        y: [0, -window.innerHeight * 1.2],
                        x: [0, Math.sin(heart.id) * 25, 0],
                        rotate: [0, 180],
                        opacity: [0, heart.opacity, 0],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart
                        size={heart.size}
                        fill={heart.id % 2 === 0 ? '#e8b4b8' : '#c9a0dc'}
                        stroke="none"
                        style={{ filter: 'blur(0.5px)' }}
                    />
                </motion.div>
            ))}

            {/* Main content */}
            <AnimatePresence>
                {showContent && (
                    <motion.div
                        className="relative z-10 text-center w-full max-w-sm"
                        initial={{ opacity: 0, y: 35, filter: 'blur(10px)', scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                        transition={{
                            duration: 0.9,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            opacity: { duration: 0.7 },
                            filter: { duration: 1 },
                            scale: { type: 'spring', damping: 20, stiffness: 100 },
                        }}
                    >
                        {/* Animated heart with glow */}
                        <motion.div
                            className="mb-8 relative mx-auto w-fit"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {/* Glow ring */}
                            <motion.div
                                className="absolute inset-0 -m-4 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(232, 180, 184, 0.3) 0%, transparent 60%)',
                                    filter: 'blur(10px)',
                                }}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <Heart
                                className="w-14 h-14 md:w-20 md:h-20 relative z-10"
                                fill="#e8b4b8"
                                stroke="#d4af37"
                                strokeWidth={0.5}
                                style={{ filter: 'drop-shadow(0 0 15px rgba(232, 180, 184, 0.5))' }}
                            />
                        </motion.div>

                        {/* Question text */}
                        <motion.h1
                            className="text-2xl md:text-4xl font-serif text-white/95 font-normal leading-snug mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Will you be my
                        </motion.h1>

                        <motion.h1
                            className="text-4xl md:text-6xl font-serif font-bold italic mb-10"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                background: 'linear-gradient(90deg, #e8b4b8, #d4af37, #e8b4b8)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 10px rgba(232, 180, 184, 0.4))',
                            }}
                            animate={{ backgroundPosition: ['0% center', '200% center'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            Valentine?
                        </motion.h1>

                        {/* Buttons - stacked for mobile */}
                        <div className="flex flex-col items-center gap-5 relative">
                            {/* Yes button */}
                            <motion.button
                                onClick={handleYes}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative w-full max-w-[220px] py-4 text-lg font-serif rounded-full overflow-hidden"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    background: 'linear-gradient(135deg, #e8b4b8, #d4a4a8)',
                                    boxShadow: '0 4px 25px rgba(232, 180, 184, 0.4)',
                                }}
                            >
                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                        backgroundSize: '200% 100%',
                                    }}
                                    animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                                {/* Glow ring */}
                                <motion.span
                                    className="absolute inset-0 rounded-full"
                                    style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
                                    animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
                                    transition={{ duration: 1.8, repeat: Infinity }}
                                />
                                <span className="relative z-10 flex items-center justify-center gap-2 text-white font-medium">
                                    Yes <Heart size={16} fill="white" stroke="none" />
                                </span>
                            </motion.button>

                            {/* No button (runs away) */}
                            <motion.button
                                onMouseEnter={handleNoHover}
                                onTouchStart={handleNoHover}
                                onClick={handleNoHover}
                                animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="px-8 py-3 text-white/40 text-base font-serif rounded-full border border-white/10"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Let me think…
                            </motion.button>
                        </div>

                        {/* Subtle hint for interactivity */}
                        {/* <motion.p
                            className="mt-10 text-xs text-white/30 font-serif"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                        >
                            ✨ Tap the hearts to feel the magic ✨
                        </motion.p> */}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Proposal;
