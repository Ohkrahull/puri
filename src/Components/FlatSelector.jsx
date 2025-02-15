import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

const WING_DATA = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
];

const FLAT_DATA = {
  'A': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
  'B': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
  'C': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
  'D': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
};

const FlatSelectorModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isWingDropdownOpen, setIsWingDropdownOpen] = useState(false);
  const [isVacant, setIsVacant] = useState(false);

  const getFilteredFlats = () => {
    if (!selectedWing) return [];
    const wingFlats = FLAT_DATA[selectedWing] || [];
    return wingFlats.filter(flat => 
      flat.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleWingSelect = (wing) => {
    setSelectedWing(wing);
    setIsWingDropdownOpen(false);
    setSearchText('');
    setSelectedFlat('');
  };

  const handleFlatSelect = (flat) => {
    setSelectedFlat(flat);
    onSelect({ wing: selectedWing, flat, isVacant });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Add Flat</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-base font-medium mb-4">Select Flat No.</h3>
          
          <div className="flex gap-4 mb-4">
            {/* Wing Dropdown */}
            <div className="relative w-1/3">
              <button
                onClick={() => setIsWingDropdownOpen(!isWingDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg flex items-center justify-between bg-white"
              >
                <span className="text-sm text-gray-700">{selectedWing || 'Wing'}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isWingDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {WING_DATA.map((wing) => (
                    <button
                      key={wing.value}
                      onClick={() => handleWingSelect(wing.value)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                    >
                      {wing.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Flat Number Search */}
            <div className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Flat number"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm"
                  disabled={!selectedWing}
                />
              </div>
            </div>
          </div>

          {/* Vacant Checkbox */}
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={isVacant}
              onChange={(e) => setIsVacant(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Vacant</span>
          </label>

          {/* Flat List */}
          {selectedWing && (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {getFilteredFlats().length > 0 ? (
                getFilteredFlats().map((flat) => (
                  <button
                    key={flat}
                    onClick={() => handleFlatSelect(flat)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm border-b border-gray-200 last:border-b-0"
                  >
                    {`${selectedWing}-${flat}`}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No flats found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (selectedWing && selectedFlat) {
                onSelect({ wing: selectedWing, flat: selectedFlat, isVacant });
              }
            }}
            disabled={!selectedWing || !selectedFlat}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlatSelectorModal;