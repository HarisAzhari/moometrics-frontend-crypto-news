// BlurFade.tsx
import React, { useEffect, useState, useRef } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const BlurFade: React.FC<BlurFadeProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Start animation after delay when element comes into view
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay * 1000);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '50px' // Start animation slightly before element comes into view
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, hasAnimated]);

  return (
    <div
      ref={elementRef}
      className={`${className} transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 blur-none translate-x-0' : 'opacity-0 blur-sm translate-x-8'
      }`}
    >
      {children}
    </div>
  );
};

export default BlurFade;