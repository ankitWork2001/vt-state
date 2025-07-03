import Image from 'next/image'
import React from 'react'
import { Heart } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { Share2 } from 'lucide-react';

function AuthorProfile({profileDetails}) {
  return (
    <div className='min-w-60 h-auto w-full max-w-full flex justify-center items-center flex-col'>      
      <img
        src={profileDetails.image}
        alt={profileDetails.name}
        width={40}
        height={40}
        className="cover-fill size-25 p-1 my-1 rounded-full"
      />
      <div className='font-semibold text-md'>{profileDetails.name}</div>
      <h5 className='py-5 w-45 text-sm text-center'>{profileDetails.heading}</h5>
    
    <div className='flex gap-8 text-center py-2 text-slate-400'>
      <div className=''>
        <Heart className='text-red-400'/>
        <p>{profileDetails.social.like}</p>
      </div>
      <div className=''>
        <MessageSquare className='text-green-400'/>
        <p>{profileDetails.social.comment}</p>
      </div>
      <div className=''>
        <Share2 className='text-blue-400'/>
        <p>{profileDetails.social.share}</p>
      </div>
    </div>
    
    </div>

  )
}

export default AuthorProfile