import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1F3C5F] text-white p-8 mt-12 mx-20">
      <div className="container mx-auto flex justify-between items-start space-x-12">
        <div>
          <p className="mb-4 font-semibold text-lg">Quick Links</p>
          <a href="#home" className="block text-sm text-white hover:text-FF914D mb-2">Home</a>
          <a href="#trending" className="block text-sm text-white hover:text-FF914D mb-2">Trending</a>
          <a href="#tools" className="block text-sm text-white hover:text-FF914D mb-2">Useful Tools</a>
          <a href="#success" className="block text-sm text-white hover:text-FF914D mb-2">Success Stories</a>
          <a href="#about" className="block text-sm text-white hover:text-FF914D mb-2">About Us</a>
          <a href="#contact" className="block text-sm text-white hover:text-FF914D mb-2">Contact Us</a>
        </div>
        <div>
          <p className="mb-4 font-semibold text-lg">Categories</p>
          <a href="#upsc" className="block text-sm text-white hover:text-FF914D mb-2">UPSC</a>
          <a href="#bpsc" className="block text-sm text-white hover:text-FF914D mb-2">BPSC</a>
          <a href="#essay" className="block text-sm text-white hover:text-FF914D mb-2">Essay Writing</a>
          <a href="#motivation" className="block text-sm text-white hover:text-FF914D mb-2">Motivation</a>
          <a href="#strategy" className="block text-sm text-white hover:text-FF914D mb-2">Strategy</a>
          <a href="#current" className="block text-sm text-white hover:text-FF914D mb-2">Current Affairs</a>
        </div>
        <div>
          <p className="mb-4 font-semibold text-lg">Customer Support</p>
          <p className="text-sm text-white mb-2">Live Chat Support</p>
          <p className="text-sm text-white mb-2">Email: support@upscblog.com</p>
          <p className="text-sm text-white mb-2">Phone: +91 XXXXX XXXXX</p>
        </div>
        <div>
          <p className="mb-4 font-semibold text-lg">Social Media</p>
          <div className="flex space-x-4">
            <a href="#instagram" className="hover:text-FF914D">
              <Instagram size={20} />
            </a>
            <a href="#facebook" className="hover:text-FF914D">
              <Facebook size={20} />
            </a>
            <a href="#youtube" className="hover:text-FF914D">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;