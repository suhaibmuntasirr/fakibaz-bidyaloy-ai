
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AdBannerProps {
  imageUrl: string;
  altText: string;
  onClick?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ imageUrl, altText, onClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-black overflow-hidden">
      <div className="w-full">
        <div 
          className="relative cursor-pointer"
          onClick={onClick}
        >
          <img 
            src={imageUrl} 
            alt={altText}
            className="w-full h-20 md:h-24 object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
