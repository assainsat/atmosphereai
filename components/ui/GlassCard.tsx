
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden ${className} transition-all duration-300`}
    >
      {children}
    </div>
  );
};
