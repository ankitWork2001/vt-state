import React from 'react'
import { Twitter } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Instagram } from 'lucide-react';

function ContactInfo() {
  return (
    <div className='w-full h-auto p-8'>
      <div className='py-5'>
        <h3 className='py-2 text-2xl font-bold'>
          We are always ready to help you and answer your questions
        </h3>
        <p className='text-sm font-normal'>
          We're here to help and answer any questions you might have. We look forward to hearing from you.
        </p>
      </div>

      <div className='py-5 block'>git 
        <strong className='font-semibold'>Our Location</strong>
        <div>
          <ul>
            <li>123 Learning Street, Suite 456, Knowledge City, 78901</li>
            <li>(555) 123-4567</li>
            <li>support@upscprep.com</li>
          </ul>
        </div>
      </div>
      
      <div className='py-5 block'>
        <strong className='font-semibold'>Hours</strong>
        <div>
          <ul>
            <li>Monday - Friday: 9 AM - 6 PM</li>
            <li>Saturday: 8 AM - 4 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>

      <div className='py-5 flex gap-4'>
        <div className='size-13 rounded-lg bg-slate-200 flex items-center justify-center'>
          <Twitter className='bg-white rounded-full size-8 p-1'/>
        </div>
        <div className='size-13 rounded-lg bg-slate-200 flex items-center justify-center'>
          <Facebook className='bg-white rounded-full size-8 p-1'/>
        </div>
        <div className='size-13 rounded-lg bg-slate-200 flex items-center justify-center'>
          <Instagram className='bg-white rounded-full size-8 p-1'/>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo















// import React from 'react'
// import Twitter from '../../public/twitter.svg'
// import Facebook from '../../public/facebook.svg'
// import Instagram from '../../public/instagram.svg'

// function ContactInfo() {
//   return (
//     <div className='w-full h-auto p-8'>
//       <div className='py-5'>
//         <h3 className='py-2 text-2xl font-bold'>We are always ready to help you and answer your questions</h3>
//         <p className='text-sm font-normal'>We're here to help and answer any questions you might have. We look forward to hearing from you.</p>
//       </div>

//       <div className='py-5 block'>
//         <strong className='font-semibold'>Our Location</strong>
//         <location>
//           <ul>
//           <li>123 Learning Street, Suite 456, Knowledge City, 78901</li>
//           <li>(555) 123-4567</li>
//           <li>support@upscprep.com</li>
//         </ul>
//         </location>
//       </div>
      
//       <div className='py-5 block'>
//         <strong className='font-semibold'>Hours</strong>
//         <time>
//           <ul>
//           <li>Monday - Friday: 9 AM - 6 PM</li>
//           <li>Saturday: 8 AM - 4 PM</li>
//           <li>Sunday: Closed</li>
//         </ul>
//         </time>
//       </div>


//       <div className='py-5 flex justify-start'>
//         <div className='size-20 rounded-lg bg-white text-slate-200'>
//           <Twitter/>
//         </div>
//         <div className='size-20 rounded-lg bg-white text-slate-200'>
//           <Facebook/>
//         </div>
//         <div className='size-20 rounded-lg bg-white text-slate-200'>
//           <Instagram/>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ContactInfo