import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useAudioContext } from '../context/AudioContext';

const MusicToggle: React.FC = () => {
    const { isMuted, isPlaying, toggleMute, playBackgroundMusic } = useAudioContext();

    const handleToggle = () => {
        if (!isPlaying) {
            playBackgroundMusic();
        } else {
            toggleMute();
        }
    };

    return (
        <motion.button
            className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer"
            style={{
                background: 'rgba(232, 180, 184, 0.15)',
                border: '1px solid rgba(232, 180, 184, 0.25)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(232, 180, 184, 0.25)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
            {!isPlaying ? (
                <Music className="w-5 h-5 text-rose-100/80" />
            ) : isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-100/60" />
            ) : (
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Volume2 className="w-5 h-5 text-rose-100/80" />
                </motion.div>
            )}

            {/* Tooltip */}
            <motion.span
                className="absolute right-14 whitespace-nowrap text-xs text-rose-100/70 bg-black/40 px-2 py-1 rounded"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
            >
                {!isPlaying ? 'Play Music' : isMuted ? 'Unmute' : 'Mute'}
            </motion.span>
        </motion.button>
    );
};

export default MusicToggle;
