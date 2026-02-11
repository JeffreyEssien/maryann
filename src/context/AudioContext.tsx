import React, { createContext, useContext, type ReactNode } from 'react';
import useAudio from '../hooks/useAudio';

type AudioContextType = ReturnType<typeof useAudio>;

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
    children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const audio = useAudio();

    return (
        <AudioContext.Provider value={audio}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioContext = (): AudioContextType => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
};

export default AudioProvider;
