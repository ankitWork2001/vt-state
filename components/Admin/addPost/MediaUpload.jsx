import React, { useRef } from 'react';
import { ImageIcon } from 'lucide-react';

const MediaUpload = () => {
  const fileInputRef = useRef(null);

  const handleMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected media:', file);
      // Optionally upload to backend with axios
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Styled button that triggers file input */}
      <button
        type="button"
        onClick={handleMediaClick}
        className="flex items-center gap-2 text-sm bg-white border px-3 py-2 rounded-md hover:bg-gray-50"
      >
        <ImageIcon size={18} />
        Add Media
      </button>
    </div>
  );
};

export default MediaUpload;
