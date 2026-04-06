import { useState, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <div 
      ref={triggerRef}
      className="inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{ 
            right: '24px', 
            top: '100px',
            left: 'auto',
            transform: 'none'
          }}
        >
          <div className="relative bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-purple-900/90 backdrop-blur-xl text-white text-sm px-5 py-4 rounded-2xl border-2 border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.3)] max-w-[340px] overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 animate-pulse" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            
            <div className="relative flex items-start gap-3">
              {/* Icon with glow */}
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                  <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-amber-300 tracking-wide text-xs uppercase">Справка</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="text-slate-100 leading-relaxed text-sm">
                  {content}
                </div>
              </div>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
