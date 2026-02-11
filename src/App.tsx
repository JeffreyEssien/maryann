import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import Prologue from './components/Prologue';
import Envelope from './components/Envelope';
import MemoryLane from './components/MemoryLane';
import Interlude from './components/Interlude';
import Proposal from './components/Proposal';

export type Scene = 'prologue' | 'envelope' | 'memory-lane' | 'interlude' | 'proposal';

function App() {
  const [scene, setScene] = useState<Scene>('prologue');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Function to start music (must be called from user gesture)
  const startMusic = () => {
    const audio = audioRef.current;
    if (audio && !isMusicPlaying) {
      audio.volume = 0.5;
      audio.loop = true;
      audio.play()
        .then(() => {
          console.log('Music started!');
          setIsMusicPlaying(true);
        })
        .catch((e) => console.error('Music failed:', e));
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePrologueComplete = () => {
    setScene('envelope');
  };

  const handleEnvelopeOpen = () => {
    // Start music on envelope click (user gesture)
    startMusic();
    setScene('memory-lane');
  };

  const handleMemoriesComplete = () => {
    setScene('interlude');
  };

  const handleInterludeComplete = () => {
    setScene('proposal');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-love-red selection:text-white font-sans">
      {/* Background Music Audio Element */}
      <audio ref={audioRef} preload="auto">
        <source src="/audio/background.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Toggle Button */}
      <motion.button
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer"
        style={{
          background: 'rgba(232, 180, 184, 0.15)',
          border: '1px solid rgba(232, 180, 184, 0.25)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(232, 180, 184, 0.25)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isMusicPlaying) {
            startMusic();
          } else {
            toggleMute();
          }
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {!isMusicPlaying ? (
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
      </motion.button>

      <AnimatePresence mode="wait">
        {scene === 'prologue' && (
          <Prologue key="prologue" onComplete={handlePrologueComplete} />
        )}
        {scene === 'envelope' && (
          <Envelope key="envelope" onOpen={handleEnvelopeOpen} onPlayMusic={startMusic} />
        )}
        {scene === 'memory-lane' && (
          <MemoryLane key="memory-lane" onComplete={handleMemoriesComplete} />
        )}
        {scene === 'interlude' && (
          <Interlude key="interlude" onComplete={handleInterludeComplete} />
        )}
        {scene === 'proposal' && (
          <Proposal key="proposal" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
