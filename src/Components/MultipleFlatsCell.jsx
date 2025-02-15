import { useState } from "react";

// Helper component to display multiple flats with dropdown
const MultipleFlatsCell = ({ flatNumbers }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    if (!Array.isArray(flatNumbers) || flatNumbers.length <= 1) {
      return <span>{flatNumbers?.[0] || 'N/A'}</span>;
    }
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
        >
          <span>{flatNumbers.length} Flats</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
  
        {isOpen && (
          <div className="absolute left-0 z-10 w-48 mt-1 bg-white border rounded-md shadow-lg">
            <div className="py-1">
              {flatNumbers.map((flat, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {flat}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default MultipleFlatsCell;