// import Image from 'next/image'
// import React from 'react'
// import profilePic from '../../public/profile.jpg'
// import Link from 'next/link'
// import { Pen } from 'lucide-react'

// const data = {
//   name: "Diya Singh",
//   email: "diayasign@gamil.com",
//   subtitles1: "UPSE",
//   subtitles2: "English",
// }

// const ProfileHeader = ({ loading = false, edit, profile = data }) => {
//   if (loading) {
//     return (
//       <div className="w-full px-4 py-8 flex flex-col items-center animate-pulse">
//         <h1 className="text-2xl font-bold mb-6 bg-gray-300 h-6 w-full" />

//         <div className="mx-auto bg-[#35590E] w-full max-w-md text-white flex flex-col items-center py-6 rounded-md">

//           <div className="rounded-full bg-gray-300 size-20 md:size-24" />

//           <div className="flex gap-2 mt-4 items-center">
//             <div className="bg-gray-300 h-5 w-32 rounded" />
//             <div className="bg-gray-300 h-5 w-5 rounded-full" />
//           </div>
//           <div className="flex gap-2 mt-4 items-center">
//             <div className="bg-gray-300 h-4 w-16 rounded" />
//             <div className="bg-gray-300 h-4 w-1.5 rounded-full" />
//             <div className="bg-gray-300 h-4 w-16 rounded" />
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full px-4 py-8 h-auto min-w-fit max-w-full border-1 flex flex-col items-center">
//       <h1 className='text-2xl font-bold mb-6 text-center'>Profile Page</h1>

//       <div className='mx-auto bg-[#35590E] w-full text-white flex flex-col items-center'>
        
//         <Image
//           className='mt-3 object-cover rounded-full bg-red-400 size-20 md:size-24'
//           alt='profile'
//           src={profilePic}
//           width={96}
//           height={96}
//         />

//         <div className='flex gap-2 mt-4'>
//           <h3 className='ml-10 text-lg font-bold items-center'>{profile.name}</h3>
//           <Link href="#">
//             <Pen className='mt-1 text-white size-5 hover:text-gray-300' />
//           </Link>
//         </div>

//         <div className='flex gap-2 m-3 text-sm md:text-base items-center'>
//           <p>{profile.subtitles1}</p>
//           {profile.subtitles2 && (
//             <>
//               <span className='text-lg'>&#8226;</span>
//               <p>{profile.subtitles2}</p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileHeader


'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import profilePic from '../../public/profile.jpg';

const defaultProfile = {
  name: "Diya Singh",
  email: "diayasign@gamil.com",
  subtitles1: "UPSE",
  subtitles2: "English",
};

const ProfileHeader = ({ loading = false, oldEdit = false, profile = defaultProfile }) => {
  const [name,setName] = useState(profile.name);
  const [prevName,setPrevName] = useState(profile.name);  
  const [edit,setEdit] = useState(oldEdit);

  const handleCancel = () => {
    console.log("Cancel clicked");
    setName(name);
    setEdit((edit)=> !edit)
  };

  const handleSave = () => {
    console.log("Save clicked", name);
    setPrevName(name)
    setEdit((edit)=> !edit)
  };

  const handleEdit = () =>{
    setName(prevName);
    setEdit((edit)=> !edit)
  }


  if (loading) {
    return (
      <div className="w-full px-4 py-8 flex flex-col items-center animate-pulse">
        <h1 className="text-2xl font-bold mb-6 bg-gray-300 h-6 w-full" />

        <div className="mx-auto bg-[#35590E] w-full max-w-md text-white flex flex-col items-center py-6 rounded-md">

          <div className="rounded-full bg-gray-300 size-20 md:size-24" />

          <div className="flex gap-2 mt-4 items-center">
            <div className="bg-gray-300 h-5 w-32 rounded" />
            <div className="bg-gray-300 h-5 w-5 rounded-full" />
          </div>
          <div className="flex gap-2 mt-4 items-center">
            <div className="bg-gray-300 h-4 w-16 rounded" />
            <div className="bg-gray-300 h-4 w-1.5 rounded-full" />
            <div className="bg-gray-300 h-4 w-16 rounded" />
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="w-full px-4 py-8 h-auto min-w-fit max-w-full flex flex-col items-center">
      <h1 className='text-2xl font-bold mb-6 text-center'>Profile Page</h1>

      <div className='mx-auto bg-[#35590E] w-full text-white flex flex-col items-center'>
        
        <Image
          className='mt-3 object-cover rounded-full bg-red-400 size-20 md:size-24'
          alt='profile'
          src={profilePic}
          width={96}
          height={96}
        />

        <div className='flex gap-2 mt-4'>
          {edit ? (
            <>
              <input 
                name="name"
                className="ml-10 text-lg font-normal items-center bg-transparent text-black border-2 border-black px-2 py-1 rounded"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
              />
            </>
          ) : (
            <>
              <h3 className="ml-10 text-lg font-bold items-center">{name}</h3>
              <Link href="#">
                <Pen onClick={handleEdit} className="mt-1 text-white size-5 hover:text-gray-300" />
              </Link>
            </>
          )}
        </div>

        <div className='flex gap-2 m-3 text-sm md:text-base items-center'>
          <p>{profile.subtitles1}</p>
          {profile.subtitles2 && (
            <>
              <span className='text-lg'>&#8226;</span>
              <p>{profile.subtitles2}</p>
            </>
          )}
        </div>

        {edit && (<div className='flex gap-3 items-center'>
          <button onClick={handleCancel} className='p-1 mb-2 w-20 rounded-md bg-transparent border-1 border-red-400 text-red-400 hover:text-red-600 transition-all duration-200'>Cancal</button>
          <button onClick={handleSave} className='p-1 mb-2 w-20 text-black rounded-md bg-green-400 hover:text-green-600 transition-all duration-200'>Save</button>
        </div>)}

      </div>
    </div>
  )
}

export default ProfileHeader
