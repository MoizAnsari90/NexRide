import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GoogleMap from '../components/GoogleMap'

const CaptainPickupMap = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const rideData = location.state || {}
  const { rider = 'Ahmed Ali', pickup = 'Gulshan-e-Iqbal Block 13', destination = 'Saddar, Karachi', fare = 350, rideId = '#123456', pickupCoords = null, destCoords = null } = rideData
  const [arrived, setArrived] = useState(false)

  const handleArrived = () => {
    setArrived(true)
  }

  const handleStartRide = () => {
    navigate('/captain-riding', {
      state: { ...rideData, status: 'riding' }
    })
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden'>

      {/* Top Bar */}
      <div className='absolute top-0 left-0 right-0 z-20'>
        <div className='bg-white shadow-sm'>
          <div className='flex items-center justify-between px-5 py-4'>
            <button onClick={() => navigate('/captain-riding', { state: rideData })} className='p-1'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className='text-base font-bold text-gray-800'>Pick up</h2>
            <div className='w-6' />
          </div>
        </div>

        {/* Distance + Address Bar */}
        <div className='mx-4 mt-3'>
          <div className='bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3'>
            <div className='bg-emerald-500 text-white px-2.5 py-1 rounded-lg'>
              <p className='text-xs font-bold'>250m</p>
            </div>
            <div className='flex-1'>
              <p className='text-sm font-semibold text-gray-800 truncate'>{destination}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Full Screen Map */}
      <div className='h-full w-full'>
        <GoogleMap pickupCoords={pickupCoords} destinationCoords={destCoords} />
      </div>

      {/* Bottom Panel */}
      <div className='absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-2xl'>
        <div className='flex items-center justify-center pt-3 pb-1'>
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
        </div>

        <div className='px-6 pb-6'>
          {/* Pickup Address */}
          <div className='flex items-center gap-3 mb-4 pt-2'>
            <div className='w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className='flex-1'>
              <p className='text-xs text-gray-400'>PICK UP AT</p>
              <p className='text-sm font-bold text-gray-800'>{pickup}</p>
            </div>
          </div>

          {/* Rider Info */}
          <div className='flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className='text-sm font-bold text-gray-800'>{rider}</p>
                <p className='text-xs text-gray-400'>⭐ 4.8 · Cash · Rs {fare}</p>
              </div>
            </div>
            {/* Call Button */}
            <button className='w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>

          {/* Action Button */}
          {!arrived ? (
            <button
              onClick={handleArrived}
              className='w-full bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all'
            >
              I'VE ARRIVED
            </button>
          ) : (
            <button
              onClick={handleStartRide}
              className='w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all'
            >
              START RIDE
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaptainPickupMap
