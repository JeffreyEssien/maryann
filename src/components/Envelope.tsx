import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

interface EnvelopeProps {
    onOpen: () => void;
    onPlayMusic?: () => void;
}

// Generate warm embers (few, elegant) - now with rose tones
const generateEmbers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 60 + Math.random() * 40,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 15,
        type: i % 3, // 0 = rose, 1 = gold, 2 = blush
    }));
};

// Generate floating hearts
const generateFloatingHearts = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 10 + Math.random() * 14,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        opacity: 0.15 + Math.random() * 0.15,
    }));
};

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, onPlayMusic }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [showEnvelope, setShowEnvelope] = useState(false);
    const [sealMelting, setSealMelting] = useState(false);

    const embers = useMemo(() => generateEmbers(18), []);
    const floatingHearts = useMemo(() => generateFloatingHearts(12), []);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), {
        stiffness: 80,
        damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), {
        stiffness: 80,
        damping: 30,
    });

    useEffect(() => {
        const timer = setTimeout(() => setShowEnvelope(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isOpened) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleOpen = () => {
        if (isOpened) return;
        setSealMelting(true);
        // Start playing music when envelope is opened
        if (onPlayMusic) {
            onPlayMusic();
        }
        setTimeout(() => {
            setIsOpened(true);
        }, 600);
        // Removed auto-advance: setTimeout(onOpen, 5500);
    };

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1200 }}
        >
            {/* Romantic rose-tinted background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #1a1318 0%, #201a1c 25%, #251d20 50%, #1c1618 75%, #141012 100%)',
                }}
            />

            {/* Soft vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)',
                }}
            />

            {/* Rose ambient glow */}
            <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse, rgba(200, 100, 120, 0.08) 0%, transparent 60%)',
                    filter: 'blur(60px)',
                }}
                animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.05, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Secondary gold-pink glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Floating hearts in background */}
            {floatingHearts.map((heart) => (
                <motion.div
                    key={`float-heart-${heart.id}`}
                    className="absolute pointer-events-none"
                    style={{ left: `${heart.x}%`, bottom: '-5%' }}
                    animate={{
                        y: [0, -window.innerHeight * 1.2],
                        x: [0, Math.sin(heart.id) * 30, 0],
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
                        fill={heart.id % 3 === 0 ? '#e8b4b8' : heart.id % 3 === 1 ? '#d4af37' : '#c9a0dc'}
                        stroke="none"
                        style={{ filter: 'blur(1px)' }}
                    />
                </motion.div>
            ))}

            {/* Love sparkles (rose, gold, blush) */}
            {embers.map((ember) => (
                <motion.div
                    key={`ember-${ember.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${ember.x}%`,
                        top: `${ember.y}%`,
                        width: ember.size,
                        height: ember.size,
                        background: ember.type === 0
                            ? 'radial-gradient(circle, #e8b4b8 0%, transparent 70%)'
                            : ember.type === 1
                                ? 'radial-gradient(circle, #d4af37 0%, transparent 70%)'
                                : 'radial-gradient(circle, #f0c4d0 0%, transparent 70%)',
                        boxShadow: ember.type === 0
                            ? '0 0 8px rgba(232, 180, 184, 0.6)'
                            : ember.type === 1
                                ? '0 0 8px rgba(212, 175, 55, 0.6)'
                                : '0 0 6px rgba(240, 196, 208, 0.5)',
                    }}
                    animate={{
                        y: [0, -80, -150],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.3],
                    }}
                    transition={{
                        duration: ember.duration,
                        delay: ember.delay,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Heading text */}
            <motion.div
                className="absolute top-16 md:top-20 left-0 right-0 text-center z-20 pointer-events-none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: showEnvelope ? 1 : 0, y: showEnvelope ? 0 : -20 }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            >
                <h2
                    className="text-base md:text-xl tracking-[0.15em] text-rose-100/70 italic"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                    }}
                >
                    Tap the heart on the envelope
                </h2>
            </motion.div>

            {/* Envelope Container */}
            <motion.div
                className="relative z-10"
                initial={{ y: -60, opacity: 0, scale: 0.95 }}
                animate={showEnvelope ? { y: 0, opacity: 1, scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
                style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
            >
                {/* Rose-gold glow behind envelope */}
                <motion.div
                    className="absolute -inset-16 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(232, 180, 184, 0.12) 0%, rgba(212, 175, 55, 0.06) 40%, transparent 60%)',
                        filter: 'blur(30px)',
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Shadow */}
                <motion.div
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[75%] h-8 rounded-[100%]"
                    style={{
                        background: 'radial-gradient(closest-side, rgba(0,0,0,0.5) 0%, transparent 100%)',
                        filter: 'blur(10px)',
                    }}
                    animate={{ scale: isOpened ? 0.6 : 1, opacity: isOpened ? 0.15 : 0.4 }}
                    transition={{ duration: 1.5 }}
                />

                <div
                    className="relative w-[320px] h-[220px] md:w-[460px] md:h-[300px] cursor-pointer"
                    onClick={handleOpen}
                >
                    {/* ENVELOPE BODY - Valentine blush theme */}
                    <motion.div
                        className="absolute inset-0 rounded-md overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #fff4f5 0%, #fce8e9 50%, #fff0f1 100%)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.35), 0 0 30px rgba(232, 180, 184, 0.15)',
                        }}
                        animate={{ opacity: isOpened ? 0 : 1 }}
                        transition={{ delay: 2, duration: 1 }}
                    >
                        {/* Paper grain texture */}
                        <div
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                            }}
                        />
                        {/* Rose gold foil edge */}
                        <div className="absolute inset-0 border-2 border-rose-300/30 rounded-md pointer-events-none" />
                        <div className="absolute inset-[3px] border border-rose-400/20 rounded-md pointer-events-none" />

                        {/* Subtle heart pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 35l-1.5-1.3C10 26 5 21.5 5 16c0-4.4 3.6-8 8-8 2.5 0 4.9 1.2 6.5 3 1.6-1.8 4-3 6.5-3 4.4 0 8 3.6 8 8 0 5.5-5 10-13.5 17.7L20 35z' fill='%23e8b4b8'/%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px',
                            }}
                        />
                    </motion.div>

                    {/* LETTER */}
                    <motion.div
                        className="absolute rounded-sm overflow-hidden"
                        style={{
                            left: '5%',
                            right: '5%',
                            top: '7%',
                            bottom: '7%',
                            background: 'linear-gradient(135deg, #fffcf7 0%, #f9f6ef 100%)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                        }}
                        initial={{ opacity: 0, y: 0, scale: 0.92 }}
                        animate={isOpened ? {
                            opacity: [0, 1, 1],
                            y: [0, -260, 40],
                            scale: [0.92, 1, 1.12],
                            zIndex: [0, 10, 100],
                        } : {
                            opacity: 0,
                            y: 0,
                            scale: 0.92,
                            zIndex: 0,
                        }}
                        transition={{
                            duration: 3,
                            times: [0, 0.4, 1],
                            ease: [0.4, 0, 0.2, 1],
                            delay: 0.6,
                        }}
                    >
                        {/* Letter Content */}
                        <div className="absolute inset-0 p-4 md:p-8 flex flex-col items-center justify-center text-center">
                            {/* Elegant corner flourishes */}
                            <div className="absolute top-3 left-3 w-12 h-12 md:w-16 md:h-16 border-t border-l border-amber-300/40 rounded-tl-lg">
                                <div className="absolute top-2 left-2 w-4 h-4 md:w-6 md:h-6 border-t border-l border-amber-400/30 rounded-tl" />
                            </div>
                            <div className="absolute top-3 right-3 w-12 h-12 md:w-16 md:h-16 border-t border-r border-amber-300/40 rounded-tr-lg">
                                <div className="absolute top-2 right-2 w-4 h-4 md:w-6 md:h-6 border-t border-r border-amber-400/30 rounded-tr" />
                            </div>
                            <div className="absolute bottom-3 left-3 w-12 h-12 md:w-16 md:h-16 border-b border-l border-amber-300/40 rounded-bl-lg">
                                <div className="absolute bottom-2 left-2 w-4 h-4 md:w-6 md:h-6 border-b border-l border-amber-400/30 rounded-bl" />
                            </div>
                            <div className="absolute bottom-3 right-3 w-12 h-12 md:w-16 md:h-16 border-b border-r border-amber-300/40 rounded-br-lg">
                                <div className="absolute bottom-2 right-2 w-4 h-4 md:w-6 md:h-6 border-b border-r border-amber-400/30 rounded-br" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isOpened ? 1 : 0 }}
                                transition={{ delay: 2.8, duration: 1 }}
                                className="space-y-4 md:space-y-6 px-4"
                            >
                                {/* Decorative top line */}
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-8 md:w-12 h-[0.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400/60" />
                                    <Heart className="w-3 h-3 text-rose-400/60" fill="currentColor" strokeWidth={0} />
                                    <div className="w-8 md:w-12 h-[0.5px] bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400/60" />
                                </div>

                                <p
                                    className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-amber-600/50"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                                >
                                    For My Dearest
                                </p>

                                <h2
                                    className="text-3xl md:text-5xl text-amber-800/90 leading-tight"
                                    style={{ fontFamily: "'Alex Brush', cursive" }}
                                >
                                    Maryann
                                </h2>

                                <p
                                    className="text-sm md:text-lg text-stone-600/80 leading-relaxed max-w-[280px] md:max-w-[340px] italic"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                                >
                                    Seemingly ordinary moments became extraordinary<br />the day you walked into my life
                                </p>

                                {/* Decorative bottom line */}
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    <div className="w-6 md:w-10 h-[0.5px] bg-gradient-to-r from-transparent to-amber-400/50" />
                                    <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-400/60 fill-rose-200/40" strokeWidth={1} />
                                    <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                                    <div className="w-6 md:w-10 h-[0.5px] bg-gradient-to-l from-transparent to-amber-400/50" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* ENVELOPE FRONT - Valentine blush */}
                    <motion.div
                        className="absolute inset-0 rounded-md overflow-hidden"
                        style={{
                            background: 'linear-gradient(to bottom, #fce8e9 0%, #f5d8da 100%)',
                            clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 100% 100%, 0 100%)',
                        }}
                        animate={{ opacity: isOpened ? 0 : 1 }}
                        transition={{ delay: 2, duration: 1 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/6 via-transparent to-transparent" />
                        {/* Subtle shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-rose-200/10" />
                    </motion.div>

                    {/* TOP FLAP */}
                    <motion.div
                        className="absolute top-0 inset-x-0 origin-top"
                        style={{
                            height: '50%',
                            transformStyle: 'preserve-3d',
                            zIndex: 50,
                        }}
                        animate={isOpened ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                        transition={{
                            rotateX: { duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
                            opacity: { duration: 1, delay: 2 }
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(to bottom, #fff4f5 0%, #fce8e9 100%)',
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                            }}
                        >
                            {/* Rose gold trim on flap edges */}
                            <div className="absolute left-0 top-0 w-[52%] h-[1px] bg-rose-400/40" style={{ transform: 'rotate(45deg) translateX(-10%)', transformOrigin: 'left top' }} />
                            <div className="absolute right-0 top-0 w-[52%] h-[1px] bg-rose-400/40" style={{ transform: 'rotate(-45deg) translateX(10%)', transformOrigin: 'right top' }} />

                            {/* Decorative heart on flap */}
                            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 pointer-events-none opacity-20">
                                <Heart size={16} fill="#e8b4b8" stroke="none" />
                            </div>
                        </div>
                    </motion.div>

                    {/* WAX SEAL - melts when tapped */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ zIndex: 60 }}
                        animate={sealMelting ? {
                            scale: [1, 1.2, 0.8, 0],
                            opacity: [1, 0.8, 0.4, 0],
                            rotate: [0, 5, -5, 0],
                            filter: ['blur(0px)', 'blur(1px)', 'blur(3px)', 'blur(8px)'],
                        } : {
                            scale: 1,
                            opacity: 1,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        {/* Seal warm glow */}
                        <motion.div
                            className="absolute -inset-3 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(180, 50, 60, 0.35) 0%, transparent 70%)',
                                filter: 'blur(6px)',
                            }}
                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <div className="relative w-12 h-12 md:w-14 md:h-14">
                            {/* Wax body */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle at 35% 35%, #c93545, #8b1e32, #5c1020)',
                                    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.25), 0 3px 10px rgba(0,0,0,0.35)',
                                }}
                            />
                            {/* Heart imprint */}
                            <div className="absolute inset-2 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-[#4a0d18]/60" fill="#5c1222" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Tap hint */}
                    <motion.p
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 font-serif italic text-ivory/40 text-sm tracking-wider"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isOpened ? 0 : 0.6 }}
                        transition={{ delay: 1.5, duration: 1 }}
                    >
                        Tap to open
                    </motion.p>
                </div>
            </motion.div>

            {/* Continue Button - Fixed at bottom of screen */}
            <motion.button
                onClick={onOpen}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 20 }}
                transition={{ delay: 3.5, duration: 0.8 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-rose-500/30"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    pointerEvents: isOpened ? 'auto' : 'none'
                }}
            >
                Continue <ChevronRight size={16} />
            </motion.button>
        </motion.div>
    );
};

export default Envelope;
