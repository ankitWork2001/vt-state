import React from 'react';

// Reusable single stat card
const StatCard = ({ heading, value, bgColor = '#ffffff' }) => {
  return (
    <div
      className="w-full sm:w-[167px] h-[88px] shadow rounded-lg p-2"
      style={{ backgroundColor: bgColor }}
    >
      <p className="text-[16px] font-semibold text-[#1F3C5F]">{heading}</p>
      <h2 className="text-3xl font-semibold">{value}</h2>
    </div>
  );
};

// Wrapper for all cards
const StatCards = ({ stats }) => {
  return (
    <div className="flex flex-wrap justify-start gap-4 sm:gap-6 md:gap-10 bg-[#F0F1FA] h-fit py-4 px-2 rounded-md mt-6">
      <StatCard heading="Total Posts" value={stats["Total Posts"]} bgColor="#F7C7AA" />
      <StatCard heading="Active Users" value={stats["Active Users"]} bgColor="#D5F8B0" />
      <StatCard heading="Avg. Read Time" value={stats["Avg. Read Time"]} bgColor="#F8B6B0" />
      <StatCard heading="Drafts" value={stats["Drafts"]} bgColor="#B0D0F8" />
    </div>
  );
};

export default StatCards;
