import React from 'react';
import ContactBanner from '@/components/Contact/ContactBanner';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactForm from '@/components/Contact/ContactForm';
import MapEmbed from '@/components/Contact/MapEmbed';
import NavigationMenu from '@/components/common/NavigationMenu';

const Contact = () => {
  return (
    <div className="bg-white">
      <NavigationMenu />
      <ContactBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
      <MapEmbed />
    </div>
  );
};

export default Contact;
