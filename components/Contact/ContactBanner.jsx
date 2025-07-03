import Image from 'next/image'
import React from 'react'
import Phone from '../../public/Phone.png'

function ContactBanner() {
  return (
    <div className='px-4 mb-10 min-w-auto w-full max-w-[80%] h-auto flex justify-between bg-green-700 place-self-center text-slate-100'>
      <h1 className='m-2 p-5 text-xl'>Contact</h1>
      <Image 
        src={Phone}
        alt='phone'
        className='size-30'
      />
    </div>
  )
}

export default ContactBanner