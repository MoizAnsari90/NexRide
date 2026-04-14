import React from 'react'

const LookingForDriver = ({ pickup, destination, vehicle, onConfirm }) => {
  return (
    <div className='flex flex-col items-center'>
      {/* Animated car */}
      <div className='relative mb-6'>
        <div className='w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center animate-pulse'>
          {vehicle?.img ? <img src={vehicle.img} alt='car' className='w-16 h-16 object-contain' /> : <span className='text-5xl'>{vehicle?.icon || '🚗'}</span>}
        </div>
        <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-200 rounded-full animate-pulse' />
      </div>

      <h3 className='text-lg font-bold text-gray-800 mb-1'>Looking for nearby drivers</h3>
      <p className='text-sm text-gray-400 mb-6'>This may take a few moments...</p>

      {/* Ride details */}
      <div className='w-full space-y-3'>
        <div className='flex items-center gap-3'>
          <div className='w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0' />
          <div className='flex-1 bg-gray-50 rounded-xl px-4 py-3'>
            <p className='text-xs text-gray-400'>Pickup</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{pickup}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-3 h-3 rounded-sm bg-gray-800 flex-shrink-0' />
          <div className='flex-1 bg-gray-50 rounded-xl px-4 py-3'>
            <p className='text-xs text-gray-400'>Destination</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{destination}</p>
          </div>
        </div>
        <div className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3'>
          <div className='flex items-center gap-2'>
            {vehicle?.img ? <img src={vehicle.img} alt={vehicle?.type} className='w-8 h-8 object-contain' /> : <span className='text-lg'>{vehicle?.icon}</span>}
            <p className='text-sm font-semibold text-gray-800'>{vehicle?.type}</p>
          </div>
          <p className='text-sm font-bold text-gray-800'>Rs {vehicle?.price}</p>
        </div>
      </div>

      {/* Confirm Ride Button */}
      <button
        onClick={onConfirm}
        className='w-full bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all mt-5'
      >
        Confirm Ride
      </button>
    </div>
  )
}

export default LookingForDriver
