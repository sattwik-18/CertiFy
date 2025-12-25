
import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CircuitPath: React.FC<{ d: string; duration?: number; delay?: number }> = ({ d, duration = 12, delay = 0 }) => (
  <motion.path
    d={d}
    fill="none"
    stroke="currentColor"
    strokeWidth="0.8"
    strokeLinecap="round"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ 
      pathLength: [0, 1, 1, 0],
      opacity: [0, 0.3, 0.3, 0]
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity, 
      ease: "easeInOut",
      times: [0, 0.3, 0.7, 1]
    }}
    className="text-brand/40"
  />
);

const CircuitNode: React.FC<{ cx: number; cy: number; delay?: number }> = ({ cx, cy, delay = 0 }) => (
  <motion.circle
    cx={cx}
    cy={cy}
    r="2"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5]
    }}
    transition={{ 
      duration: 6, 
      delay, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className="fill-brand/60 shadow-[0_0_10px_rgba(212,255,63,0.8)]"
  />
);

export const BackgroundEffects: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax layers for depth
  const yCircuit = useTransform(scrollY, [0, 1000], [0, -100]);
  const yParticles = useTransform(scrollY, [0, 1000], [0, -250]);
  const yGrid = useTransform(scrollY, [0, 1000], [0, -40]);

  const circuitData = useMemo(() => [
    // Top Left
    { path: "M-100,200 L150,200 L230,280 L500,280", delay: 0, node: {x: 230, y: 280} },
    { path: "M80,50 L150,120 L350,120", delay: 3, node: {x: 150, y: 120} },
    // Top Right
    { path: "M1000,150 L1150,300 L1350,300 L1450,400", delay: 1.5, node: {x: 1150, y: 300} },
    { path: "M1100,50 L1250,200", delay: 5, node: {x: 1250, y: 200} },
    // Center regions
    { path: "M400,600 L550,600 L650,500 L850,500 L950,600", delay: 2, node: {x: 650, y: 500} },
    { path: "M0,450 L180,450 L280,350", delay: 4, node: {x: 180, y: 450} },
    // Bottom regions
    { path: "M300,900 L500,700 L700,700 L800,800", delay: 6, node: {x: 700, y: 700} },
    { path: "M1440,750 L1250,750 L1150,650 L1000,650", delay: 3.5, node: {x: 1150, y: 650} },
  ], []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-brand-bg">
      {/* 1. Base Grid Layer with Parallax */}
      <motion.div 
        style={{ y: yGrid }}
        className="absolute inset-0 grid-pattern opacity-30 radial-gradient-mask" 
      />
      
      {/* 2. Circuit Pathway Layer */}
      <motion.svg 
        style={{ y: yCircuit }}
        className="absolute inset-0 w-full h-full opacity-50 blur-[0.3px]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
      >
        {circuitData.map((item, i) => (
          <React.Fragment key={`circuit-${i}`}>
            <CircuitPath d={item.path} delay={item.delay} />
            <CircuitNode cx={item.node.x} cy={item.node.y} delay={item.delay + 1} />
          </React.Fragment>
        ))}
      </motion.svg>

      {/* 3. Drifting Light Particles */}
      <motion.div style={{ y: yParticles }} className="absolute inset-0">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              y: [0, -150],
              x: [0, (Math.random() - 0.5) * 60]
            }}
            transition={{ 
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-[1.5px] h-[1.5px] bg-brand/50 rounded-full blur-[0.5px]"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </motion.div>
      
      {/* 4. Abstract Softly Glowing Shapes (Floating Blobs) */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.1, 0.18, 0.12, 0.15, 0.1],
          x: [0, 50, -30, 20, 0],
          y: [0, -40, 60, -20, 0],
          rotate: [0, 45, 90, 45, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-gradient-to-br from-brand/20 via-brand/5 to-transparent rounded-[40%_60%_70%_30%/50%] blur-[120px]"
      />
      
      <motion.div 
        animate={{
          scale: [1, 1.1, 1.3, 0.9, 1],
          opacity: [0.08, 0.14, 0.1, 0.12, 0.08],
          x: [0, -60, 40, -20, 0],
          y: [0, 80, -30, 40, 0],
          rotate: [0, -30, -60, -30, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-500/15 via-blue-500/5 to-transparent rounded-[60%_40%_30%_70%/50%] blur-[140px]"
      />

      {/* 5. Subtle Top Shimmer Beam */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
    </div>
  );
};

export const BorderBeam: React.FC<{ active?: boolean }> = ({ active = true }) => {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute inset-[-1px] rounded-xl border border-brand/40 pointer-events-none z-10"
    />
  );
};
