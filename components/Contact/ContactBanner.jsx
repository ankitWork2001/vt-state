import Image from 'next/image';
import React from 'react';

function ContactBanner() {
  return (
    <div className="lg:px-10 md:px-8 my-6 sm:my-8 w-full max-w-[85%] mx-auto flex flex-col sm:flex-row justify-between items-center bg-green-700 text-slate-100 rounded-lg">
      <h1 className="m-2 p-4 text-lg sm:text-xl font-semibold text-center sm:text-left">
        Contact Us
      </h1>
      <Image 
        src='/Phone.png'
        alt="Contact phone icon"
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
        width={96}
        height={96}
      />
    </div>
  );
}

export default ContactBanner;