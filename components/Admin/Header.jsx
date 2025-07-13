'use client';
import React from "react";
import { Menu, UserCircle2 } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-[#CED9E6] py-3 h-[97px] px-6 flex justify-between items-center rounded-md shadow relative z-40">
      {/* Mobile Menu Button */}
      <button
        className="sm:hidden bg-[#FAFAFA] p-2 rounded-md"
        onClick={onMenuClick}
      >
        <Menu size={24} className="text-[#1F3C5F]" />
      </button>

      {/* User Avatar */}
      <div className="flex items-center gap-2 left-[85%] relative">
        <div className="bg-[#FAFAFA] w-14 h-14 p-1 rounded-full flex items-center justify-center">
          <UserCircle2 size={24} className="text-gray-700" />
        </div>
        <span className="text-sm font-medium text-[#1F3C5F]">Admin322</span>
      </div>
    </header>
  );
};

export default Header;
