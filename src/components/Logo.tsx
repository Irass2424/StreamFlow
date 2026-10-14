import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${iconSize} rounded-xl gradient-brand flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/20`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <polygon points="10 13 15 16 10 19 10 13" fill="currentColor" />
        </svg>
      </div>

      {!collapsed && (
        <span className={`${textSize} font-extrabold tracking-tight text-white`}>
          Stream<span className="gradient-brand-text">Flow</span>
        </span>
      )}
    </div>
  );
};
