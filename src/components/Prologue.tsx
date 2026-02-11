import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface PrologueProps {
    onComplete: () => void;
}

// Generate dust particles
const generateDust = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 8,
        duration: 15 + Math.random() * 20,
        drift: (Math.random() - 0.5) * 30,
    }));
};

const Prologue: React.FC<PrologueProps> = ({ onComplete }) => {
    const [showText, setShowText] = useState(false);
    const [showSubtitle, setShowSubtitle] = useState(false);

    const dust = useMemo(() => generateDust(30), []);

    const mainText = "Hi Maryann,"
    const subtitle = "I have something for you";

    // Start text after initial fade in
    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Show subtitle after main text
    useEffect(() => {
        if (showText) {
            const timer = setTimeout(() => setShowSubtitle(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [showText]);

    // Transition after subtitle
    useEffect(() => {
        if (showSubtitle) {
            const timer = setTimeout(() => onComplete(), 3500);
            return () => clearTimeout(timer);
        }
    }, [showSubtitle, onComplete]);

    // Letter animation variants for buttery smooth effect
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            }
        }
    };

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: 'blur(8px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring' as const,
                damping: 20,
                stiffness: 100,
            }
        }
    };

    const subtitleContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0.1,
            }
        }
    };

    const subtitleLetterVariants = {
        hidden: {
            opacity: 0,
            y: 10,
            filter: 'blur(4px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring' as const,
                damping: 25,
                stiffness: 120,
            }
        }
    };

    return (
        <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
        >
            {/* Charcoal to Plum velvet gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #1a1a1f 0%, #2d1f2d 25%, #3d2a3d 50%, #2a1f2a 75%, #1a1a1f 100%)',
                }}
            />

            {/* Soft vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
                }}
            />

            {/* Dust particles drifting */}
            {dust.map((d) => (
                <motion.div
                    key={`dust-${d.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${d.x}%`,
                        top: `${d.y}%`,
                        width: d.size,
                        height: d.size,
                        background: 'rgba(255, 248, 240, 0.4)',
                        boxShadow: '0 0 4px rgba(255, 248, 240, 0.3)',
                    }}
                    animate={{
                        x: [0, d.drift, 0],
                        y: [0, -20, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: d.duration,
                        delay: d.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Main content */}
            <div className="relative z-10 text-center px-8">
                {/* Main text - letter by letter with blur */}
                <motion.h1
                    className="text-4xl md:text-6xl text-rose-100/95 mb-6 min-h-[60px]"
                    style={{
                        fontFamily: "'Alex Brush', cursive",
                        textShadow: '0 0 40px rgba(255, 200, 200, 0.25)',
                        letterSpacing: '0.02em',
                    }}
                    variants={containerVariants}
                    initial="hidden"
                    animate={showText ? "visible" : "hidden"}
                >
                    {mainText.split('').map((char, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Subtitle - letter by letter with blur */}
                <motion.p
                    className="text-xl md:text-3xl text-rose-100/70 min-h-[40px] italic"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        letterSpacing: '0.08em',
                        fontWeight: 300,
                    }}
                    variants={subtitleContainerVariants}
                    initial="hidden"
                    animate={showSubtitle ? "visible" : "hidden"}
                >
                    {subtitle.split('').map((char, index) => (
                        <motion.span
                            key={index}
                            variants={subtitleLetterVariants}
                            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Prologue;
