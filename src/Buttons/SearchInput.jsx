import React, { useState } from 'react';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const mockData = [
    'Robert Fox',
    'Courtney Henry',
    'Eleanor Pena',
    'Jenny Wilson'
  ];

  const filteredResults = mockData.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  return (
    <div className="relative">
      <div className="flex justify-between">
        <div style={{
          display: 'flex',
          padding: '8px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          alignSelf: 'stretch',
          border: '1px solid #D1D5DB',
          borderRadius: '10px',
          color: '#6B7280',
          fontSize: '16px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          width: '300px',
        }}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              background: 'transparent',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
            }}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
          </svg>
        </div>
      </div>
      {showDropdown && filteredResults.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {filteredResults.map((result, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              style={{
                display: 'flex',
                padding: '12px 16px',
                alignItems: 'center',
                gap: '10px',
                alignSelf: 'stretch',
                borderBottom: '1px solid #E5E7EB',
                color: '#6B7280',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
              }}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;