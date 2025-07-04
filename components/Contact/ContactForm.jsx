'use client'

import React, { useState } from 'react'

function ContactForm() {
  const [formdata, setFormdata] = useState({
    name: '',
    email: '',
    message: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormdata({ ...formdata, [name]: value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormdata({name: '',email: '',message: ''})
    console.log(formdata)
  }

  return (
    <div className='w-full h-auto lg:p-10 sm:p-1'>
      <div className='text-2xl font-bold'>Send us a message</div>
      <form className='space-4' onSubmit={handleSubmit}>
        <label htmlFor='name'></label>
        <input
          name='name'
          type='text'
          value={formdata.name}
          onChange={handleChange}
          className='p-1 px-2 my-5 h-10 w-min-60 w-full max-w-[90%] border-1 border-slate-300 focus:cursor-pointer rounded-md'
          placeholder='Your Name'
        />

        <label htmlFor='email'></label>
        <input
          name='email'
          type='email'
          value={formdata.email}
          onChange={handleChange}
          className='p-1 px-2 my-5 h-10 w-min-60 w-full max-w-[90%] border-1 border-slate-300 focus:cursor-pointer rounded-md'
          placeholder='Your Email'
        />

        <label htmlFor='message'></label>
        <textarea
          name='message'
          rows='8'
          cols='45'
          value={formdata.message}
          onChange={handleChange}
          className='p-1 px-2 my-5 w-min-60 w-full max-w-[90%] border-1 border-slate-300 focus:cursor-pointer rounded-md'
          placeholder='Your Message'
        ></textarea>

        <button
          type='submit'
          className='p-1 my-5 w-35 h-10 rounded-md bg-orange-400 text-white'
        >
          Send a message
        </button>

        <p className='text-xs'>Thank you for your message! We'll get back to you soon.</p>
      </form>
    </div>
  )
}

export default ContactForm
