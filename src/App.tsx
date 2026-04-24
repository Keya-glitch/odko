/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, Sparkles, Music, Star, Flower2, ArrowRight, Skull, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import YouTube, { YouTubeProps } from 'react-youtube';

type ViewState = 'qr' | 'envelope' | 'greeting';

interface Splatter {
  id: number;
  x: number;
  y: number;
}

export default function App() {
  const [view, setView] = useState<ViewState>('qr');
  const [isOpen, setIsOpen] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [splatters, setSplatters] = useState<Splatter[]>([]);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setAppUrl(window.location.href);

    const handleClick = (e: MouseEvent) => {
      setSplatters(prev => [...prev, {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      }]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#8b0000', '#000000', '#333333', '#ffffff']
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#8b0000', '#000000', '#333333', '#ffffff']
      });
    }, 250);
  };

  const handleStartGreeting = () => {
    setView('greeting');
    triggerConfetti();
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const videoOptions: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 bg-black">
      
      {/* Click Splatters */}
      {splatters.map(s => (
        <div key={s.id} className="blood-splatter pointer-events-none" style={{ left: s.x - 50, top: s.y - 50 }} />
      ))}

      {/* Lightning Flash Effect */}
      <div className="lightning-flash" />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1510519133411-9ec9c68cc342?auto=format&fit=crop&q=80&w=1920" 
          alt="Dark Gothic Architecture" 
          className="w-full h-full object-cover opacity-20 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 mist-overlay" />
        
        {/* Blood Drip Elements */}
        <div className="blood-pool" />
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="blood-drip"
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${150 + Math.random() * 300}px`,
              opacity: Math.random() * 0.6 + 0.3
            }}
          />
        ))}
      </div>

      {/* Hidden YouTube Player for Audio */}
      <div className="hidden">
        <YouTube videoId="Vp5k4do6EGs" opts={videoOptions} onReady={onPlayerReady} />
      </div>

      {/* Floating Gothic Elements Animation */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => {
          const isSkull = i % 2 === 0;
          return (
          <motion.div
            key={i}
            className={isSkull ? "absolute text-zinc-600/30" : "absolute text-orange-600/30"}
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0.1 
            }}
            animate={{ 
              y: [0, -60, 0],
              x: [0, 40, -40, 0],
              opacity: [0.1, 0.4, 0.1],
              rotate: [0, 20, -20, 0]
            }}
            transition={{ 
              duration: 7 + Math.random() * 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: Math.random() * 2 
            }}
          >
            {isSkull ? <Skull size={Math.random() * 30 + 10} /> : <Flame size={Math.random() * 40 + 10} />}
          </motion.div>
          );
        })}
      </div>

      <main className="relative z-20 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {view === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="font-gothic text-5xl text-[#8b0000] tracking-widest uppercase">Нууц Урилга</h1>
                <p className="text-[#666] font-serif italic text-lg pb-2">Сүүдрийн ертөнцөөс ирсэн мэндчилгээ...</p>
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-900 p-8 rounded-3xl shadow-[0_0_40px_rgba(139,0,0,0.3)] border-2 border-[#8b0000]/30 relative"
              >
                <div className="absolute -top-4 -right-4 bg-[#8b0000] text-white p-3 rounded-md shadow-lg rotate-12">
                  <Star fill="white" size={24} />
                </div>
                <div className="p-2 bg-white/5 rounded-xl">
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-[180px] h-[180px] stroke-[#8b0000] fill-none stroke-[2px]" 
                    style={{ filter: 'drop-shadow(0 0 10px rgba(139,0,0,0.5))' }}
                  >
                    {/* Inverted Pentagram */}
                    <circle cx="50" cy="50" r="45" />
                    <path d="M 50 95 L 76.4 13.6 L 7.2 63.9 L 92.8 63.9 L 23.6 13.6 Z" />
                    
                    {/* Goat head */}
                    <g fill="#8b0000" className="fill-[#8b0000]/20">
                      {/* Face shape */}
                      <path d="M 50 95 L 35 55 L 42 45 L 58 45 L 65 55 Z" />
                      {/* Horns */}
                      <path d="M 42 45 Q 30 20 23.6 13.6 Q 35 30 45 42 M 58 45 Q 70 20 76.4 13.6 Q 65 30 55 42" strokeLinecap="round"/>
                      {/* Ears */}
                      <path d="M 35 55 Q 20 55 7.2 63.9 Q 25 65 38 58 M 65 55 Q 80 55 92.8 63.9 Q 75 65 62 58" />
                    </g>
                    {/* Eyes */}
                    <path d="M 40 55 L 46 52 L 40 58 Z M 60 55 L 54 52 L 60 58 Z" fill="#8b0000" stroke="none" />
                  </svg>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ x: 5, color: '#ff0000' }}
                onClick={() => setView('envelope')}
                className="flex items-center gap-3 text-[#8b0000] font-gothic tracking-[0.2em] text-2xl group uppercase"
              >
                Орох <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {view === 'envelope' && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex flex-col items-center space-y-8"
            >
              <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <motion.div
                  animate={{ rotate: isOpen ? 5 : 0 }}
                  className="w-80 h-48 bg-[#0a0a0a] rounded-sm shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] relative flex items-center justify-center border border-[#8b0000]/20 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,0,0,0.1),transparent_80%)]" />
                  
                  {/* Decorative Borders */}
                  <div className="absolute inset-2 border border-[#8b0000]/10 pointer-events-none" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: isOpen ? 1.2 : 1, rotate: isOpen ? 15 : 0, opacity: isOpen ? 0.3 : 1 }}
                      className="w-14 h-14 wax-seal z-10 flex items-center justify-center shadow-lg"
                    />
                  </div>
                  
                  <motion.div 
                    className="absolute -top-1 w-full flex justify-center z-0"
                    animate={{ y: isOpen ? -30 : 0 }}
                  >
                    <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[96px] border-t-zinc-900 rounded-t-sm shadow-md" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={false}
                  animate={{ y: isOpen ? -60 : 0, opacity: isOpen ? 1 : 0 }}
                  className="absolute left-4 right-4 top-4 h-32 bg-zinc-900 border border-[#8b0000]/20 rounded-md shadow-lg flex items-center justify-center p-4 text-center"
                >
                  <p className="font-serif italic text-[#8b0000] text-lg">Сүүдэр дунд нуугдсан захиа...</p>
                </motion.div>
              </div>

              <div className="text-center space-y-6">
                <motion.h2 className="font-gothic text-4xl text-[#d1d1d1] tracking-wider uppercase">
                  Бяцхан бэлэг
                </motion.h2>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139,0,0,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartGreeting}
                  className="bg-[#3d0000] text-[#d1d1d1] px-10 py-4 rounded-none border border-[#8b0000] font-gothic tracking-[0.1em] shadow-lg transition-all flex items-center gap-3 mx-auto text-xl uppercase"
                >
                  Нээж үзэх <Gift size={22} className="text-[#8b0000]" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'greeting' && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-gradient-goth p-8 md:p-12 rounded-none shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col items-center gap-8 relative overflow-hidden"
            >
              {/* Decorative Corner Elements */}
              <div className="absolute -top-6 -left-6 text-[#2d0000]/40 rotate-45">
                <Flower2 size={120} />
              </div>
              <div className="absolute -bottom-6 -right-6 text-[#2d0000]/40 -rotate-45">
                <Flower2 size={120} />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center gap-4 mb-2">
                  <Star className="text-[#8b0000] fill-[#4a0000]" size={24} />
                  <Heart className="text-[#b22222] fill-[#2d0000]" size={24} />
                  <Star className="text-[#8b0000] fill-[#4a0000]" size={24} />
                </div>

                <h1 className="font-gothic text-6xl md:text-7xl text-[#8b0000] leading-tight text-glow-goth tracking-tighter">
                  Төрсөн өдрийн <br />
                  <span className="text-[#d1d1d1] italic lowercase opacity-80">мэнд...</span>
                </h1>

                <p className="text-lg text-[#999] leading-relaxed max-w-md mx-auto font-serif italic font-light">
                  Хамгийн нууцлаг, хамгийн үзэсгэлэнтэй нэгэн гэж хэлвэл кринж шаалөө юу ч бичдэгийн тээ? хаха энэ хорвоогийн хамгийн онцгой өдрийн мэндийг хүргэе. Заримдаа сүүдэрт ч гэсэн хамгийн тод гэрэл оршдог...
                </p>

                <div className="h-px w-32 bg-[#2d0000] mx-auto" />

                <p className="font-gothic text-2xl text-[#666] tracking-[0.2em] uppercase">
                  Чи бол үүрд гэрэлтэх од нь энэ үгнээс motivation ав ваахахвахва ...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                className="relative py-4"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#8b0000]/50 to-transparent" />
                <h2 data-text="KEYA" className="glitch relative z-10 font-gothic text-7xl md:text-8xl text-[#8b0000] tracking-[0.2em] text-glow-goth uppercase drop-shadow-[0_0_15px_rgba(220,20,60,0.5)]">
                  KEYA
                </h2>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-transparent to-[#8b0000]/50" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-t from-transparent to-[#8b0000]/50" />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  confetti({
                    particleCount: 300,
                    spread: 120,
                    startVelocity: 50,
                    origin: { y: 0.6 },
                    colors: ['#8b0000', '#4a0000', '#000000', '#1a1a1a']
                  });
                }}
                className="text-[#8b0000] underline underline-offset-8 font-gothic tracking-widest text-lg uppercase"
              >
                ДАР!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Dark Flowers */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
         {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-zinc-800"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              x: [0, 60, 0],
              y: [0, 40, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear",
            }}
          >
            <Flower2 size={Math.random() * 50 + 30} />
          </motion.div>
        ))}
      </div>
      
      <footer className="mt-auto relative z-20 pt-8 pb-4 flex flex-col items-center gap-2">
        {view !== 'qr' && (
          <button 
            onClick={() => {
              setView('qr');
              if (playerRef.current) {
                playerRef.current.pauseVideo();
              }
            }}
            className="text-[10px] text-zinc-600 hover:text-[#8b0000] transition-colors uppercase tracking-[0.3em] font-medium"
          >
            Гарах
          </button>
        )}
        <p className="text-zinc-700 font-gothic tracking-widest uppercase text-xs">үхсэндээ уншаад байгаан чи унт...</p>
      </footer>
    </div>
  );
}
