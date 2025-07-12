'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

export default function ClientLayout({ children }) {
  const pathname = usePathname()

  // Hide layout on auth routes
  const hideLayout = pathname.startsWith('/auth')

  // Responsive toast position
  const [position, setPosition] = useState('bottom-right')

  useEffect(() => {
    const handleResize = () => {
      setPosition(window.innerWidth < 640 ? 'top-center' : 'bottom-right')
    }

    handleResize() // set on initial render
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className={!hideLayout ? 'pt-20' : ''}>
        {children}
      </main>

      {!hideLayout && <Footer />}

      <div className="fixed z-[9999]">
        <Toaster position={position} richColors closeButton />
      </div>
    </>
  )
}
