import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface InterludeProps {
    onComplete: () => void;
}

const Interlude: React.FC<InterludeProps> = ({ onComplete }) => {
    const [showText, setShowText] = useState(false);
    const [showSecondLine, setShowSecondLine] = useState(false);

    const mainText = "Maryann…";
    const secondLine = "There's something I've wanted to ask you";

    // Start text after initial fade in
    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Show second line after main text
    useEffect(() => {
        if (showText) {
            const timer = setTimeout(() => setShowSecondLine(true), 1800);
            return () => clearTimeout(timer);
        }
    }, [showText]);

    // Transition after second line
    useEffect(() => {
        if (showSecondLine) {
            const timer = setTimeout(() => onComplete(), 3500);
            return () => clearTimeout(timer);
        }
    }, [showSecondLine, onComplete]);

    // Letter animation variants for buttery smooth effect
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            }
        }
    };

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 25,
            filter: 'blur(10px)',
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            transition: {
                type: 'spring' as const,
                damping: 18,
                stiffness: 80,
            }
        }
    };

    const secondContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.025,
                delayChildren: 0.1,
            }
        }
    };

    const secondLetterVariants = {
        hidden: {
            opacity: 0,
            y: 12,
            filter: 'blur(6px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring' as const,
                damping: 22,
                stiffness: 100,
            }
        }
    };

    return (
        <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
        >
            {/* Near-black background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #0a0808 0%, #0d0606 50%, #080505 100%)',
                }}
            />

            {/* Subtle heartbeat glow in center */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(139, 30, 50, 0.08) 0%, transparent 40%)',
                }}
                animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Faint pulsing heart icon */}
            <motion.div
                className="absolute pointer-events-none"
                style={{ top: '35%' }}
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <Heart size={40} fill="#8b1e32" stroke="none" style={{ filter: 'blur(2px)' }} />
            </motion.div>

            {/* Main content */}
            <div className="relative z-10 text-center px-8">
                {/* Main text - letter by letter with blur */}
                <motion.h1
                    className="text-5xl md:text-7xl text-rose-100/90 mb-8 min-h-[60px]"
                    style={{
                        fontFamily: "'Alex Brush', cursive",
                        textShadow: '0 0 50px rgba(200, 100, 120, 0.3)',
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

                {/* Second line - letter by letter with blur */}
                <motion.p
                    className="text-xl md:text-3xl text-rose-100/70 min-h-[50px] italic"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        letterSpacing: '0.04em',
                        fontWeight: 300,
                        textShadow: '0 0 25px rgba(200, 100, 120, 0.2)',
                    }}
                    variants={secondContainerVariants}
                    initial="hidden"
                    animate={showSecondLine ? "visible" : "hidden"}
                >
                    {secondLine.split('').map((char, index) => (
                        <motion.span
                            key={index}
                            variants={secondLetterVariants}
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

export default Interlude;
