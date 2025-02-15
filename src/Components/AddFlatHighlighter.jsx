import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AddFlatHighlighter = () => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if the current path matches the Add Flat page
    const isAddFlatPage = location.pathname === '/flatmain';
    
    if (isAddFlatPage) {
      setIsHighlighted(true);
      
      // Create a timeout to remove the highlight after a few seconds
      const highlightTimer = setTimeout(() => {
        setIsHighlighted(false);
      }, 5000); // Highlight for 5 seconds

      // Cleanup the timer
      return () => clearTimeout(highlightTimer);
    }
  }, [location.pathname]);

  if (!isHighlighted) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
      <div 
        className="absolute top-[140px] right-6 animate-pulse"
        style={{ 
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.3)',
          borderRadius: '0.5rem',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      >
        <div 
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"
          style={{ animationDuration: '1.5s' }}
        />
      </div>
      <div 
        className="absolute top-[140px] right-6 bg-blue-50 rounded-lg p-2 text-blue-600 text-sm shadow-lg border border-blue-100 max-w-xs"
        style={{ 
          animation: 'fadeIn 0.5s ease-out',
          marginRight: '2.5rem'
        }}
      >
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>Add Flat button is here!</span>
        </div>
      </div>
    </div>
  );
};

// Add custom styles
const styles = document.createElement('style');
styles.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(styles);

export default AddFlatHighlighter;