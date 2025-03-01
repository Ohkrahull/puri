

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import SEARCHABLE_ROUTES from './Searchable_Routes';


const GlobalSearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Track mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   // Apply mobile-specific fixes for viewport
   useEffect(() => {
    if (isMobile) {
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        // Store original content
        const originalContent = metaViewport.getAttribute('data-original') || metaViewport.content;
        if (!metaViewport.getAttribute('data-original')) {
          metaViewport.setAttribute('data-original', originalContent);
        }
        metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
      }
    }
    
    return () => {
      if (isMobile) {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport && metaViewport.getAttribute('data-original')) {
          metaViewport.content = metaViewport.getAttribute('data-original');
        }
      }
    };
  }, [isMobile]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K to focus search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          setIsDropdownOpen(true);
        }
      }
      // Escape to close search
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const performSearch = useCallback((term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    const lowercaseTerm = term.toLowerCase();
    const results = SEARCHABLE_ROUTES.map(category => ({
      ...category,
      items: category.items.filter(route => 
        route.name.toLowerCase().includes(lowercaseTerm) ||
        route.breadcrumb.some(bc => bc.toLowerCase().includes(lowercaseTerm))
      )
    })).filter(category => category.items.length > 0);

    setSearchResults(results);
    setIsDropdownOpen(true);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

//   const handleSearchSelect = (path) => {
//     navigate(path);
//     setIsDropdownOpen(false);
//     setSearchTerm('');
//   };
const handleSearchSelect = (result) => {
    if (!result) return;
  
    let actionType = null;
    const resultNameLower = (result.name || '').toLowerCase();
    const breadcrumbs = result.breadcrumb || [];
    
    // Check if it's an add action
    if (resultNameLower.includes('add') || 
        breadcrumbs.some(bc => bc && bc.toLowerCase().includes('add'))) {
      actionType = 'add';
    }
    // Check if it's an export action 
    else if (resultNameLower.includes('export') || 
             breadcrumbs.some(bc => bc && bc.toLowerCase().includes('export'))) {
      actionType = 'export';
    }
  
    // Add highlight parameter to URL if there's an action type
    const highlightParam = actionType ? `?highlight=${actionType}` : '';
    navigate(`${result.path}${highlightParam}`);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div 
      ref={searchContainerRef} 
      className="relative flex-1 max-w-5xl transition-all duration-300 ease-in-out"
      style={{ fontFamily: "Plus_Jakarta" }}
    >
      <div className="relative w-full">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <input
          ref={searchInputRef}
          id="global-search-input"
          type="search"
          placeholder="Search"
          className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && performSearch(searchTerm)}
        />
        {searchTerm && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setIsDropdownOpen(false);
            }}
            style={{cursor: 'pointer'}}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {/* <X size={14} /> */}
          </button>
        )}
        {!searchTerm && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd 
            
            className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
              ctrl + k
            </kbd>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[500px] overflow-y-auto">
          {searchResults.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border-b last:border-b-0 border-gray-100">
              <div className="px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category.category}
              </div>
              <ul>
                {category.items.map((result, index) => (
                  <li 
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer group"
                    onClick={() => handleSearchSelect(result)}
                  >
                    {/* <div className="flex items-center justify-between">
                      <div>
                        <div className='flex'>

                        
                      <span className="mr-3 w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                              <result.icon size={16} weight="regular" />
                            </span>
                        <span className="font-medium text-gray-800 group-hover:text-blue-600">
                          {result.name}
                        </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          {result.breadcrumb.map((bc, bcIndex) => (
                            <React.Fragment key={bc}>
                              {bcIndex > 0 && (
                                <ChevronRight 
                                  size={12} 
                                  className="mx-1 text-gray-400" 
                                />
                              )}
                              <span>{bc}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <ChevronRight 
                        size={20} 
                        className="text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" 
                      />
                    </div> */}
                     <div className="flex items-center">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <span className="mr-3 w-6 h-6 mt-1  rounded flex items-center justify-center">
                              <result.icon size={16} className="text-gray-500"  color="gray"/>
                            </span>
                            <span className="font-medium text-gray-800">
                              {result.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-9">
                            {result.breadcrumb.join(' → ')}
                          </div>
                        </div>
                        <ChevronRight 
                        size={20} 
                        className="text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" 
                      />
                      </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchDropdown;