import React from 'react'

function MapEmbed({companyName="IIT Madras", location = "https://www.google.com/maps/embed/v1/place?q=iit%20madras&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}) {
  return (
    <div className='my-5 mr-15 min-w-auto w-full max-w-[80%] h-auto place-self-center text-slate-100'>
      <div className="relative text-right h-60 min-w-60 w-full max-w-full">
        <div className="overflow-hidden bg-transparent w-full h-full">
          <iframe
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={location}>
          </iframe>
        </div>
        <a
          href="https://norsumediagroup.com/embed-google-map-website-free"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-center py-1 text-gray-500 no-underline">
          {companyName}
        </a>
      </div>
    </div>
  )
}

export default MapEmbed