import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const EnhancedImageViewer = ({ isOpen, imageUrl, onClose, name }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={handleZoomIn}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ZoomIn className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ZoomOut className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={handleRotate}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <RotateCw className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={name}
          className="max-w-full max-h-[85vh] object-contain transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Images/profile.png';
          }}
        />
        {name && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
            {name}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedImageViewer;