
import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300 border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-brand/5 group cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const Button: React.FC<{ 
  variant?: 'primary' | 'secondary' | 'ghost'; 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}> = ({ variant = 'secondary', children, className, onClick, isLoading }) => {
  const variants = {
    primary: "bg-brand text-black hover:bg-brand-dark shadow-[0_0_20px_rgba(212,255,63,0.3)] hover:shadow-[0_0_30px_rgba(212,255,63,0.5)]",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
    ghost: "bg-transparent text-white hover:bg-white/5"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "relative px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden",
        variants[variant],
        className
      )}
    >
      {/* Subtle overlay glow layer */}
      <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/[0.05] to-white/0 pointer-events-none" />
      
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      )}
    </motion.button>
  );
};

// Added className prop to fix property 'className' does not exist error in App.tsx
// Added inline-block to allow vertical margins (like mt-4) on the span element
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'neutral'; className?: string }> = ({ children, variant = 'neutral', className }) => {
  const styles = {
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-white/5 text-white/70 border-white/10"
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border inline-block", styles[variant], className)}>
      {children}
    </span>
  );
};
