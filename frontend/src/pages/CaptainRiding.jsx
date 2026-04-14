import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GoogleMap from '../components/GoogleMap'
import SwipeablePanel from '../components/SwipeablePanel'

const CaptainRiding = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const rideData = location.state || {}
  const { rider = 'Ahmed Ali', pickup = 'Gulshan-e-Iqbal Block 13', destination = 'Saddar, Karachi', fare = 350, rideId = '#123456', pickupCoords = null, destCoords = null, status } = rideData
  const [rideStatus, setRideStatus] = useState(status || 'pickup') // pickup | riding | completed

  const handleGoToPickup = () => {
    navigate('/captain-pickup-map', { state: rideData })
  }

  const handleCompleteRide = () => {
    setRideStatus('completed')
  }

  const handleFinish = () => {
    navigate('/captain-home')
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-100'>

      {/* Top Bar */}
      <div className='absolute top-0 left-0 right-0 z-20 bg-white shadow-sm'>
        <div className='flex items-center justify-between px-5 py-4'>
          <button onClick={() => navigate('/captain-home')} className='p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className='text-sm font-bold text-gray-500'>{rideId}</p>
          <div className='w-6' />
        </div>
      </div>

      {/* Map */}
      <div className='h-full w-full'>
        <GoogleMap pickupCoords={pickupCoords} destinationCoords={destCoords} />
      </div>

      {/* Bottom Panel */}
      <SwipeablePanel isOpen={true} onClose={() => navigate('/captain-home')} zIndex={10}>
        {/* Rider Info + Fare */}
        <div className='flex items-center justify-between mb-5 pt-2'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className='text-base font-bold text-gray-800'>{rider}</p>
              <p className='text-xs text-gray-400'>⭐ 4.8</p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-xl font-bold text-gray-800'>Rs {fare}</p>
            <p className='text-xs text-gray-400'>Cash</p>
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
                <p className='text-sm font-semibold text-gray-800 truncate'>{pickup}</p>
              </div>
              <div className='bg-gray-50 rounded-xl px-4 py-2.5'>
                <p className='text-xs text-gray-400'>Destination</p>
                <p className='text-sm font-semibold text-gray-800 truncate'>{destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ride Notes */}
        <div className='bg-gray-50 rounded-xl px-4 py-3 mb-5'>
          <p className='text-xs text-gray-400 mb-1'>Ride Notes</p>
          <p className='text-sm text-gray-600'>
            Passenger will be waiting at the main gate. Please call on arrival.
          </p>
        </div>

        {/* Payment Details */}
        <div className='bg-gray-50 rounded-xl px-4 py-3 mb-5'>
          <p className='text-xs text-gray-400 mb-2'>Payment Details</p>
          <div className='flex items-center justify-between mb-1.5'>
            <p className='text-sm text-gray-600'>Ride Fare</p>
            <p className='text-sm font-semibold text-gray-800'>Rs {fare}</p>
          </div>
          <div className='flex items-center justify-between mb-1.5'>
            <p className='text-sm text-gray-600'>Discount</p>
            <p className='text-sm font-semibold text-emerald-600'>- Rs 0</p>
          </div>
          <div className='border-t border-gray-200 my-2' />
          <div className='flex items-center justify-between'>
            <p className='text-sm font-bold text-gray-800'>Total</p>
            <p className='text-sm font-bold text-gray-800'>Rs {fare}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button className='flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-200 active:scale-[0.98] transition-all'>
            Message
          </button>

          {rideStatus === 'pickup' && (
            <button
              onClick={handleGoToPickup}
              className='flex-1 bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all'
            >
              GO TO PICK UP
            </button>
          )}

          {rideStatus === 'riding' && (
            <button
              onClick={handleCompleteRide}
              className='flex-1 bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all'
            >
              COMPLETE RIDE
            </button>
          )}

          {rideStatus === 'completed' && (
            <button
              onClick={handleFinish}
              className='flex-1 bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all'
            >
              FINISH
            </button>
          )}
        </div>
      </SwipeablePanel>
    </div>
  )
}

export default CaptainRiding
