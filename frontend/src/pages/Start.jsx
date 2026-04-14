import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Start = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/home')
    }
  }, [])

  return (
    <div className='h-screen w-screen flex flex-col justify-between bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=800)]'>
        <div className='pt-8 pl-8'>
            <h1 className='text-3xl font-bold text-white'>NexRide</h1>
        </div>
        <div className='bg-white p-8 rounded-t-3xl'>
            <h2 className='text-2xl font-bold mb-4'>Get Started with NexRide</h2>
            <Link to='/login' className='block text-center w-full bg-black text-white py-3 rounded-lg text-lg font-semibold'>
                Continue
            </Link>
        </div>
    </div>
  )
}

export default Start