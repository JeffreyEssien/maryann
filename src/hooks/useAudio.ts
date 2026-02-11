import { useRef, useState, useCallback, useEffect } from 'react';

// Royalty-free audio sources - Local files (guaranteed to work)
// Files are stored in /public/audio/ folder
export const AUDIO_SOURCES = {
    // Background music - soft piano piece
    backgroundMusic: '/audio/background.mp3',

    // Alternative music - same for now
    romanticPiano: '/audio/background.mp3',

    // Sound effects - using chime for all effects for now
    // These will play just the beginning of the track
    envelopeOpen: '/audio/chime.mp3',
    heartbeat: '/audio/chime.mp3',
    magicSparkle: '/audio/chime.mp3',
    celebration: '/audio/chime.mp3',
    softChime: '/audio/chime.mp3',
};

interface AudioState {
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
}

export const useAudio = () => {
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        isMuted: false,
        volume: 0.5,
    });

    // Pre-load audio files
    const preloadAudio = useCallback((key: string, src: string, options?: { loop?: boolean; volume?: number }) => {
        if (!audioRefs.current[key]) {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.loop = options?.loop ?? false;
            audio.volume = options?.volume ?? state.volume;
            audioRefs.current[key] = audio;
        }
        return audioRefs.current[key];
    }, [state.volume]);

    // Play a sound effect
    const playSound = useCallback((key: string, options?: { volume?: number; loop?: boolean; fadeIn?: boolean }) => {
        const audio = audioRefs.current[key];
        if (!audio || state.isMuted) return;

        audio.volume = options?.volume ?? state.volume;
        audio.loop = options?.loop ?? false;
        audio.currentTime = 0;

        if (options?.fadeIn) {
            audio.volume = 0;
            audio.play().catch((e) => console.log('Audio play error:', e));

            // Fade in over 2 seconds
            const targetVolume = options?.volume ?? state.volume;
            const fadeInterval = setInterval(() => {
                if (audio.volume < targetVolume - 0.05) {
                    audio.volume = Math.min(audio.volume + 0.05, targetVolume);
                } else {
                    audio.volume = targetVolume;
                    clearInterval(fadeInterval);
                }
            }, 100);
        } else {
            audio.play().catch((e) => console.log('Audio play error:', e));
        }
    }, [state.isMuted, state.volume]);

    // Stop a sound
    const stopSound = useCallback((key: string, options?: { fadeOut?: boolean }) => {
        const audio = audioRefs.current[key];
        if (!audio) return;

        if (options?.fadeOut) {
            // Fade out over 1.5 seconds
            const fadeInterval = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume = Math.max(audio.volume - 0.05, 0);
                } else {
                    audio.volume = 0;
                    audio.pause();
                    audio.currentTime = 0;
                    clearInterval(fadeInterval);
                }
            }, 75);
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setState(prev => {
            const newMuted = !prev.isMuted;
            Object.values(audioRefs.current).forEach(audio => {
                audio.muted = newMuted;
            });
            return { ...prev, isMuted: newMuted };
        });
    }, []);

    // Set volume for all audio
    const setVolume = useCallback((volume: number) => {
        setState(prev => {
            Object.values(audioRefs.current).forEach(audio => {
                audio.volume = volume;
            });
            return { ...prev, volume };
        });
    }, []);

    // Play background music
    const playBackgroundMusic = useCallback(() => {
        console.log('Starting background music...');
        const bgMusic = preloadAudio('bgMusic', AUDIO_SOURCES.backgroundMusic, { loop: true, volume: 0.3 });
        bgMusic.loop = true;

        // Fade in the background music
        bgMusic.volume = 0;
        bgMusic.play()
            .then(() => console.log('Background music playing!'))
            .catch((e) => console.log('Background music error:', e));

        const fadeInterval = setInterval(() => {
            if (bgMusic.volume < 0.25) {
                bgMusic.volume = Math.min(bgMusic.volume + 0.02, 0.3);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);

        setState(prev => ({ ...prev, isPlaying: true }));
    }, [preloadAudio]);

    // Stop background music
    const stopBackgroundMusic = useCallback(() => {
        stopSound('bgMusic', { fadeOut: true });
        setState(prev => ({ ...prev, isPlaying: false }));
    }, [stopSound]);

    // Pre-load common sounds
    const initializeSounds = useCallback(() => {
        preloadAudio('bgMusic', AUDIO_SOURCES.backgroundMusic, { loop: true, volume: 0.3 });
        preloadAudio('envelopeOpen', AUDIO_SOURCES.envelopeOpen, { volume: 0.6 });
        preloadAudio('sparkle', AUDIO_SOURCES.magicSparkle, { volume: 0.4 });
        preloadAudio('celebration', AUDIO_SOURCES.celebration, { volume: 0.5 });
        preloadAudio('chime', AUDIO_SOURCES.softChime, { volume: 0.4 });
        preloadAudio('heartbeat', AUDIO_SOURCES.heartbeat, { volume: 0.3 });
    }, [preloadAudio]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
                audio.src = '';
            });
        };
    }, []);

    return {
        ...state,
        playSound,
        stopSound,
        toggleMute,
        setVolume,
        playBackgroundMusic,
        stopBackgroundMusic,
        initializeSounds,
        preloadAudio,
    };
};

export default useAudio;
