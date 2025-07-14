import React, { useRef } from 'react';
import { ImageIcon } from 'lucide-react';

const MediaUpload = ({ mediaFile, onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
      console.log('Selected media:', file);
    } else {
      console.log("No file selected");
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
        {mediaFile ? mediaFile.name : <p>Add Media</p>}
      </button>
    </div>
  );
};

export default MediaUpload;
