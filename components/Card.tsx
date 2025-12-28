import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel border border-white/50 rounded-3xl shadow-xl p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};