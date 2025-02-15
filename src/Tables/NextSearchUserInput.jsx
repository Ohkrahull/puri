import React, { useState, useEffect, useRef } from 'react';

const NextSearchUserInput = ({ onItemClick, onSearch, users, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      filterUsers(searchTerm);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const filterUsers = (inputValue) => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      user.email.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredUsers(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onSearch(inputValue);
    filterUsers(inputValue);
  };

  const handleItemClick = (user) => {
    onItemClick(user);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        ref={inputRef}
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search users..."
        className="w-full p-2 border rounded"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto">
          {filteredUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(user)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NextSearchUserInput;