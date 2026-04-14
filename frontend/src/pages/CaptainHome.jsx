import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleMap, { loadGoogleMapsScript } from '../components/GoogleMap'
import SwipeablePanel from '../components/SwipeablePanel'
import { CaptainDataContext } from '../context/CaptainContext'
import api from '../api/axios'

const rideData = {
  rider: 'Ahmed Ali',
  pickup: 'Gulshan-e-Iqbal Block 13',
  destination: 'Saddar, Karachi',
  fare: 350,
  rideId: '#123456'
}

const geocodeAddress = async (address) => {
  await loadGoogleMapsScript()
  const geocoder = new window.google.maps.Geocoder()
  return new Promise((resolve) => {
    geocoder.geocode({ address: `${address}, Karachi, Pakistan` }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        })
      } else {
        resolve(null)
      }
    })
  })
}

const CaptainHome = () => {
  const [isOnline, setIsOnline] = useState(false)
  const [rideReceived, setRideReceived] = useState(false)  // ride exists
  const [ridePopup, setRidePopup] = useState(false)        // modal visible
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destCoords, setDestCoords] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { captain } = useContext(CaptainDataContext)

  // Geocode when ride is received
  useEffect(() => {
    if (!rideReceived) {
      setPickupCoords(null)
      setDestCoords(null)
      return
    }

    const fetchCoords = async () => {
      const [pCoords, dCoords] = await Promise.all([
        geocodeAddress(rideData.pickup),
        geocodeAddress(rideData.destination),
      ])
      setPickupCoords(pCoords)
      setDestCoords(dCoords)
    }
    fetchCoords()
  }, [rideReceived])

  const toggleOnline = () => {
    setIsOnline(!isOnline)
    if (!isOnline) {
      setTimeout(() => {
        setRideReceived(true)
        setRidePopup(true)
      }, 3000)
    } else {
      setRidePopup(false)
      setRideReceived(false)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    try {
      await api.get('/captain/logout', {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      // logout even if API fails
    }
    localStorage.removeItem('token')
    navigate('/captain-login')
  }

  const acceptRide = () => {
    setRidePopup(false)
    setRideReceived(false)
    navigate('/captain-riding', {
      state: {
        ...rideData,
        pickupCoords,
        destCoords,
      }
    })
  }

  // Swipe down = just hide modal, keep map markers
  const closePopup = () => {
    setRidePopup(false)
  }

  // Ignore = fully cancel ride
  const ignoreRide = () => {
    setRidePopup(false)
    setRideReceived(false)
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-100'>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className='absolute inset-0 bg-black/40 z-50'
        />
      )}

      {/* Drawer */}
      <div className={`absolute top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Close Button */}
        <button
          onClick={() => setDrawerOpen(false)}
          className='absolute top-5 right-4 z-10 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Profile Header */}
        <div className='px-6 pt-12 pb-5'>
          <div className='flex items-center gap-4 mb-5'>
            <div className='w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/25'>
              <span className='text-white text-xl font-bold'>
                {(captain?.fullname?.firstname || captain?.fullname || 'C')[0].toUpperCase()}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-base font-bold text-gray-900 truncate'>
                {captain?.fullname?.firstname || captain?.fullname || 'Captain'} {captain?.fullname?.lastname || captain?.lastname || ''}
              </h3>
              <p className='text-xs text-gray-400 truncate'>{captain?.email || ''}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className='flex items-center gap-2'>
            <div className='flex-1 bg-gray-50 rounded-xl py-2.5 px-3 text-center'>
              <p className='text-sm font-bold text-gray-800'>15</p>
              <p className='text-[10px] text-gray-400 mt-0.5'>Trips</p>
            </div>
            <div className='flex-1 bg-gray-50 rounded-xl py-2.5 px-3 text-center'>
              <p className='text-sm font-bold text-emerald-600'>4.8</p>
              <p className='text-[10px] text-gray-400 mt-0.5'>Rating</p>
            </div>
            <div className='flex-1 bg-gray-50 rounded-xl py-2.5 px-3 text-center'>
              <p className='text-sm font-bold text-gray-800'>30K</p>
              <p className='text-[10px] text-gray-400 mt-0.5'>Earned</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='mx-6 h-px bg-gray-100' />

        {/* Vehicle Details + Menu — scrollable middle */}
        <div className='flex-1 overflow-y-auto px-4 py-3 space-y-0.5'>
          {/* Vehicle Section Header */}
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-1 pb-2'>Vehicle Details</p>

          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h6m2 0h4l2-2V8a1 1 0 00-1-1h-3" />
              </svg>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Vehicle Type</p>
              <p className='text-sm font-semibold text-gray-800 capitalize'>{captain?.vehicle?.vehicleType || '-'}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Color</p>
              <p className='text-sm font-semibold text-gray-800 capitalize'>{captain?.vehicle?.color || '-'}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Plate Number</p>
              <p className='text-sm font-semibold text-gray-800 uppercase'>{captain?.vehicle?.plate || '-'}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Capacity</p>
              <p className='text-sm font-semibold text-gray-800'>{captain?.vehicle?.capacity || '-'} seats</p>
            </div>
          </div>

          {/* Divider */}
          <div className='mx-2 h-px bg-gray-100 my-2' />

          {/* Menu Items */}
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-1 pb-2'>Menu</p>

          <div className='flex items-center gap-3 px-3 py-3 rounded-xl bg-emerald-50 cursor-pointer'>
            <div className='w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
            </div>
            <p className='text-sm font-bold text-emerald-700'>Home</p>
          </div>
          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'>
            <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className='text-sm font-semibold text-gray-600'>My Trips</p>
          </div>
          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'>
            <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className='text-sm font-semibold text-gray-600'>Earnings</p>
          </div>
          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'>
            <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className='text-sm font-semibold text-gray-600'>Settings</p>
          </div>
        </div>

        {/* Logout — fixed at bottom, never overlaps */}
        <div className='px-4 pb-6 pt-2'>
          <div className='h-px bg-gray-100 mb-3' />
          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl text-sm font-bold hover:bg-red-100 active:scale-[0.98] transition-all'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Top Bar */}
      <div className='absolute top-0 left-0 right-0 z-20 bg-white shadow-sm'>
        <div className='flex items-center justify-between px-5 py-4'>
          {/* Hamburger */}
          <button onClick={() => setDrawerOpen(true)} className='p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Status */}
          <h2 className='text-base font-bold text-gray-800'>{isOnline ? 'Online' : 'Offline'}</h2>

          {/* Toggle */}
          <button
            onClick={toggleOnline}
            className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${isOnline ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`px-5 py-3 text-center transition-colors duration-300 ${isOnline ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className={`text-sm font-bold ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isOnline ? 'You are online!' : 'You are offline!'}
          </p>
          <p className={`text-xs mt-0.5 ${isOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isOnline ? 'Waiting for ride requests...' : 'Go online to start accepting jobs'}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className='h-full w-full'>
        <GoogleMap pickupCoords={pickupCoords} destinationCoords={destCoords} />
      </div>

      {/* Bottom Driver Card */}
      <div className='absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-2xl'>
        <div className='flex items-center justify-center pt-3 pb-1'>
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
        </div>

        {/* Driver Profile */}
        <div className='flex items-center gap-4 px-6 py-4'>
          <div className='w-14 h-14 rounded-full overflow-hidden ring-2 ring-emerald-500 ring-offset-2'>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent((captain?.fullname?.firstname || captain?.fullname || 'C') + '+' + (captain?.fullname?.lastname || captain?.lastname || ''))}&background=10b981&color=fff&bold=true&size=128`}
              alt='Captain'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-bold text-gray-800'>
              {captain?.fullname?.firstname || captain?.fullname || 'Captain'} {captain?.fullname?.lastname || captain?.lastname || ''}
            </h3>
            <p className='text-xs text-gray-400'>Basic level</p>
          </div>
          <button
            onClick={handleLogout}
            className='bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 transition-all'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className='flex items-center justify-around px-6 pb-6 pt-2'>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className='text-2xl font-bold text-gray-800'>10.2</p>
            <p className='text-xs text-gray-400 uppercase tracking-wide'>Hours Online</p>
          </div>

          <div className='w-px h-12 bg-gray-200' />

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className='text-2xl font-bold text-gray-800'>30K</p>
            <p className='text-xs text-gray-400 uppercase tracking-wide'>Earnings</p>
          </div>

          <div className='w-px h-12 bg-gray-200' />

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className='text-2xl font-bold text-gray-800'>15</p>
            <p className='text-xs text-gray-400 uppercase tracking-wide'>Total Trips</p>
          </div>
        </div>
      </div>

      {/* Mini bar to swipe up / tap to reopen */}
      {rideReceived && !ridePopup && (
        <div
          onClick={() => setRidePopup(true)}
          className='absolute bottom-0 left-0 right-0 z-30 bg-emerald-500 rounded-t-2xl shadow-lg cursor-pointer'
        >
          <div className='flex items-center justify-center pt-2 pb-1'>
            <div className='w-10 h-1 bg-white/50 rounded-full' />
          </div>
          <div className='flex items-center justify-between px-6 pb-4 pt-1'>
            <div>
              <p className='text-white text-sm font-bold'>New Ride Request</p>
              <p className='text-white/70 text-xs'>Swipe up to view details</p>
            </div>
            <div className='bg-white/20 rounded-full p-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Ride Request Popup */}
      <SwipeablePanel isOpen={ridePopup} onClose={closePopup} zIndex={40}>
        <h3 className='text-lg font-bold text-gray-800 mb-1'>New Ride Request!</h3>
        <p className='text-sm text-gray-400 mb-5'>2.5 km away</p>

        {/* Rider Info */}
        <div className='flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4'>
          <div className='w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500 ring-offset-1'>
            <img
              src={`https://ui-avatars.com/api/?name=Ahmed+Ali&background=10b981&color=fff&bold=true&size=80`}
              alt='Ahmed Ali'
              className='w-full h-full object-cover'
            />
          </div>
          <div>
            <p className='text-sm font-bold text-gray-800'>Ahmed Ali</p>
            <p className='text-xs text-gray-400'>⭐ 4.8</p>
          </div>
        </div>

        {/* Route */}
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
                <p className='text-sm font-semibold text-gray-800'>Gulshan-e-Iqbal Block 13</p>
              </div>
              <div className='bg-gray-50 rounded-xl px-4 py-2.5'>
                <p className='text-xs text-gray-400'>Destination</p>
                <p className='text-sm font-semibold text-gray-800'>Saddar, Karachi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fare */}
        <div className='flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 mb-5'>
          <p className='text-sm font-semibold text-emerald-700'>Estimated Fare</p>
          <p className='text-lg font-bold text-emerald-700'>Rs 350</p>
        </div>

        {/* Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={ignoreRide}
            className='flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-300 active:scale-[0.98] transition-all'
          >
            Ignore
          </button>
          <button
            onClick={acceptRide}
            className='flex-1 bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all'
          >
            Accept
          </button>
        </div>
      </SwipeablePanel>
    </div>
  )
}

export default CaptainHome
