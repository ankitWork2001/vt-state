import React from 'react';
import MissionSection from '@/components/About/MissionSection';
import WhyChooseUs from '@/components/About/WhyChooseUs';
import NavigationMenu from '@/components/common/NavigationMenu';

const About = () => {
  return (
    <div className="bg-white">
      <NavigationMenu />
      <MissionSection />
      <WhyChooseUs />
    </div>
  );
};

export default About;
