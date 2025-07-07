'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import google from '../../public/google.png';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebaseConfig'; // ✅ Import the initialized auth

function LoginForm() {
  const [phoneEmail, setPhoneEmail] = useState('');
  const [error, setError] = useState('');
  const provider = new GoogleAuthProvider();
  const router = useRouter();


useEffect(() => {
  if (!error) return;

  const errorTimeout = setTimeout(() => {
    setError('');
  }, 5000);

  return () => clearTimeout(errorTimeout);
}, [error]);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log("Submitted:", phoneEmail);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='my-10 mx-auto w-full h-screen text-center'>
      <h1 className='my-10 text-3xl font-bold'>Mindful Path</h1>

      <form
        onSubmit={handleSubmit}
        className='h-[30rem] w-[95%] sm:w-[70%] max-w-[600px] mx-auto bg-[#E9EBF8] flex flex-col items-center p-6 rounded'
      >
        <p className='mt-20 my-5 text-sm font-semibold'>Admin Dashboard access</p>

        <input
          type='text'
          aria-label='Phone or Email'
          className='p-3 my-2 bg-transparent border border-blue-300 focus:border-red-400 rounded h-10 w-full max-w-[70%] font-semibold'
          placeholder='Enter phone / email ID'
          required
          value={phoneEmail}
          onChange={(e) => setPhoneEmail(e.target.value)}
        />

        <button
          type='submit'
          className='cursor-pointer p-1 my-2 text-white bg-[#8BC54B] hover:bg-green-500 rounded h-10 w-full max-w-[70%] font-semibold'
        >
          Continue
        </button>

        <div className='flex items-center w-full max-w-[70%] my-4'>
          <div className='flex-1 h-px bg-slate-400'></div>
          <p className='px-2 text-sm'>OR</p>
          <div className='flex-1 h-px bg-slate-400'></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type='button'
          className='cursor-pointer p-1 my-2 text-white bg-[#1F3C5F] hover:bg-[#1c3556] rounded h-10 w-full max-w-[70%] font-semibold flex items-center justify-center gap-2'
        >
          Sign Up with Google
          <Image
            src={google}
            alt='Google logo'
            width={20}
            height={20}
            priority
          />
        </button>

        {error && (
          <div className="mt-2 text-rose-400 text-sm max-w-[70%] font-semibold">{error}</div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
