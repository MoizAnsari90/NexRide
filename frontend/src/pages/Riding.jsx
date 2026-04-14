import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import GoogleMap from '../components/GoogleMap'

const Riding = () => {
  const location = useLocation()
  const rideData = location.state || {}
  const { pickup, destination, vehicle } = rideData

  return (
    <div className='h-screen w-screen relative overflow-hidden'>

      {/* Logo */}
      <div className='absolute top-6 left-6 z-10'>
        <h1 className='text-2xl font-extrabold tracking-tight px-4 py-2 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm'>
          Nex<span className='text-emerald-500'>Ride</span>
        </h1>
      </div>

      {/* Map */}
      <div className='h-full w-full'>
        <GoogleMap />
      </div>

      {/* Bottom Panel */}
      <div className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6'>
        <div className='flex items-center justify-center mb-4'>
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
        </div>

        {/* Ride Status Header */}
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h3 className='text-lg font-bold text-gray-800'>Ride in progress</h3>
            <p className='text-sm text-gray-400'>On the way to destination</p>
          </div>
          <div className='bg-black text-white px-4 py-2 rounded-xl text-center'>
            <p className='text-lg font-bold leading-tight'>12</p>
            <p className='text-xs'>min</p>
          </div>
        </div>

        {/* Route Info */}
        <div className='space-y-3 mb-5'>
          <div className='flex items-center gap-3'>
            <div className='flex flex-col items-center gap-1'>
              <div className='w-3 h-3 rounded-full bg-emerald-500' />
              <div className='w-0.5 h-6 bg-gray-300' />
              <div className='w-3 h-3 rounded-sm bg-gray-800' />
            </div>
            <div className='flex-1 space-y-2'>
              <div className='bg-gray-50 rounded-xl px-4 py-2.5'>
                <p className='text-xs text-gray-400'>Pickup</p>
                <p className='text-sm font-semibold text-gray-800 truncate'>{pickup || 'Pickup location'}</p>
              </div>
              <div className='bg-gray-50 rounded-xl px-4 py-2.5'>
                <p className='text-xs text-gray-400'>Destination</p>
                <p className='text-sm font-semibold text-gray-800 truncate'>{destination || 'Destination'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className='flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className='text-sm font-bold text-gray-800'>Ahmed Khan</p>
              <p className='text-xs text-gray-400'>White Suzuki Alto · ⭐ 4.9</p>
            </div>
          </div>
          <p className='text-sm font-bold text-gray-800'>KHI-1234</p>
        </div>

        {/* Vehicle + Price + Payment */}
        <div className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4'>
          <div className='flex items-center gap-2'>
            {vehicle?.img ? <img src={vehicle.img} alt={vehicle?.type} className='w-8 h-8 object-contain' /> : <span className='text-lg'>{vehicle?.icon || '🚗'}</span>}
            <div>
              <p className='text-sm font-semibold text-gray-800'>{vehicle?.type || 'Standard'}</p>
              <p className='text-xs text-gray-400'>Cash Payment</p>
            </div>
          </div>
          <p className='text-sm font-bold text-gray-800'>Rs {vehicle?.price || '---'}</p>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-around mb-5'>
          <button className='flex flex-col items-center gap-1'>
            <div className='w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className='text-xs text-gray-500'>Safety</span>
          </button>

          <button className='flex flex-col items-center gap-1'>
            <div className='w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className='text-xs text-gray-500'>Share trip</span>
          </button>

          <button className='flex flex-col items-center gap-1'>
            <div className='w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className='text-xs text-gray-500'>Call driver</span>
          </button>
        </div>

        {/* Make Payment Button */}
        <Link
          to='/home'
          className='block w-full bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide text-center hover:bg-emerald-600 active:scale-[0.98] transition-all'
        >
          Make a Payment
        </Link>
      </div>
    </div>
  )
}

export default Riding
