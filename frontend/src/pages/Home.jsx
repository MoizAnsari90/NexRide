import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import Riding from '../components/Riding'
import GoogleMap from '../components/GoogleMap'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
  const [pickupText, setPickupText] = useState('')
  const [destinationText, setDestinationText] = useState('')
  const [pickup, setPickup] = useState(null)           // { name, address, lat, lng }
  const [destination, setDestination] = useState(null)  // { name, address, lat, lng }
  const [panelOpen, setPanelOpen] = useState(false)
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
  const [lookingForDriver, setLookingForDriver] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [riding, setRiding] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [activeField, setActiveField] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useContext(UserDataContext)

  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const lookingPanelRef = useRef(null)
  const waitingPanelRef = useRef(null)
  const ridingPanelRef = useRef(null)
  const arrowRef = useRef(null)

  // Search panel animation
  useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, { height: '75%', duration: 0.5, ease: 'power4.out' })
      gsap.to(arrowRef.current, { opacity: 1, duration: 0.3 })
    } else {
      gsap.to(panelRef.current, { height: 'auto', duration: 0.5, ease: 'power4.out' })
      gsap.to(arrowRef.current, { opacity: 0, duration: 0.3 })
    }
  }, [panelOpen])

  // Vehicle panel animation
  useEffect(() => {
    gsap.to(vehiclePanelRef.current, {
      y: vehiclePanelOpen ? 0 : '100%',
      duration: 0.5,
      ease: vehiclePanelOpen ? 'power4.out' : 'power4.in',
    })
  }, [vehiclePanelOpen])

  // Looking for driver panel animation
  useEffect(() => {
    gsap.to(lookingPanelRef.current, {
      y: lookingForDriver ? 0 : '100%',
      duration: 0.5,
      ease: lookingForDriver ? 'power4.out' : 'power4.in',
    })
  }, [lookingForDriver])

  // Waiting for driver panel animation
  useEffect(() => {
    gsap.to(waitingPanelRef.current, {
      y: waitingForDriver ? 0 : '100%',
      duration: 0.5,
      ease: waitingForDriver ? 'power4.out' : 'power4.in',
    })
  }, [waitingForDriver])

  // Riding panel animation
  useEffect(() => {
    gsap.to(ridingPanelRef.current, {
      y: riding ? 0 : '100%',
      duration: 0.5,
      ease: riding ? 'power4.out' : 'power4.in',
    })
  }, [riding])

  const handleLocationSelect = (location) => {
    if (activeField === 'pickup') {
      setPickup(location)
      setPickupText(location.name)
      if (destination) {
        setPanelOpen(false)
        setActiveField(null)
        setVehiclePanelOpen(true)
      }
    } else {
      setDestination(location)
      setDestinationText(location.name)
      if (pickup) {
        setPanelOpen(false)
        setActiveField(null)
        setVehiclePanelOpen(true)
      }
    }
  }

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
    setVehiclePanelOpen(false)
    setLookingForDriver(true)
  }

  const handleConfirmRide = () => {
    setLookingForDriver(false)
    setWaitingForDriver(true)

    // 3 sec baad driver arrive → riding shuru
    setTimeout(() => {
      setWaitingForDriver(false)
      setRiding(true)
    }, 3000)
  }

  const handleRideEnd = () => {
    setRiding(false)
    setSelectedVehicle(null)
    setPickup(null)
    setDestination(null)
    setPickupText('')
    setDestinationText('')
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (pickup && destination) {
      setPanelOpen(false)
      setActiveField(null)
      setVehiclePanelOpen(true)
    }
  }

  const closePanel = () => {
    setPanelOpen(false)
    setActiveField(null)
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden'>

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
                {(user?.fullname || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-base font-bold text-gray-900 truncate'>
                {user?.fullname || 'User'} {user?.lastname || ''}
              </h3>
              <p className='text-xs text-gray-400 truncate'>{user?.email || ''}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className='flex items-center gap-2'>
            <div className='flex-1 bg-gray-50 rounded-xl py-2.5 px-3 text-center'>
              <p className='text-sm font-bold text-gray-800'>12</p>
              <p className='text-[10px] text-gray-400 mt-0.5'>Rides</p>
            </div>
            <div className='flex-1 bg-gray-50 rounded-xl py-2.5 px-3 text-center'>
              <p className='text-sm font-bold text-emerald-600'>4.9</p>
              <p className='text-[10px] text-gray-400 mt-0.5'>Rating</p>
            </div>
            <div className='flex-1 bg-gray-50 rounded-xl py-2.5 px-3 text-center'>
              <p className='text-sm font-bold text-gray-800'>6 mo</p>
              <p className='text-[10px] text-gray-400 mt-0.5'>Member</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='mx-6 h-px bg-gray-100' />

        {/* Menu Items — scrollable middle */}
        <div className='flex-1 overflow-y-auto px-4 py-3 space-y-0.5'>
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
            <p className='text-sm font-semibold text-gray-600'>My Rides</p>
          </div>
          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'>
            <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className='text-sm font-semibold text-gray-600'>Payment</p>
          </div>
          <div className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'>
            <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className='text-sm font-semibold text-gray-600'>Safety</p>
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
            onClick={() => navigate('/userlogout')}
            className='w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl text-sm font-bold hover:bg-red-100 active:scale-[0.98] transition-all'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Logo */}
      <div className='absolute top-6 left-6 z-10'>
        <h1 className='text-2xl font-extrabold tracking-tight px-4 py-2 rounded-xl shadow-sm'>
          Nex<span className='text-emerald-500'>Ride</span>
        </h1>
      </div>

      {/* Profile Button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className='absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:bg-white transition-all'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {/* Map */}
      <div className='h-full w-full'>
        <GoogleMap
          pickupCoords={pickup ? { lat: pickup.lat, lng: pickup.lng } : null}
          destinationCoords={destination ? { lat: destination.lat, lng: destination.lng } : null}
        />
      </div>

      {/* Panel 1 — Search (Inputs + Suggestions) */}
      <div
        ref={panelRef}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden'
      >
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <button ref={arrowRef} onClick={closePanel} className='p-1 opacity-0'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className='w-10 h-1 bg-gray-300 rounded-full cursor-pointer' onClick={() => setPanelOpen(!panelOpen)} />
            <div className='w-6' />
          </div>

          <h2 className='text-xl font-bold text-gray-800 mb-1'>Find a trip</h2>
          <p className='text-sm text-gray-400 mb-4'>Your ride, on demand</p>

          <form onSubmit={submitHandler} className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='flex flex-col items-center gap-1'>
                <div className='w-3 h-3 rounded-full bg-emerald-500' />
                <div className='w-0.5 h-8 bg-gray-300' />
                <div className='w-3 h-3 rounded-sm bg-gray-800' />
              </div>
              <div className='flex-1 space-y-3'>
                <input
                  type='text'
                  placeholder='Add a pick-up location'
                  value={pickupText}
                  onChange={(e) => { setPickupText(e.target.value); setPickup(null) }}
                  onFocus={() => { setPanelOpen(true); setVehiclePanelOpen(false); setActiveField('pickup') }}
                  className={`w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none border transition-all placeholder-gray-400 ${activeField === 'pickup' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'}`}
                />
                <input
                  type='text'
                  placeholder='Enter your destination'
                  value={destinationText}
                  onChange={(e) => { setDestinationText(e.target.value); setDestination(null) }}
                  onFocus={() => { setPanelOpen(true); setVehiclePanelOpen(false); setActiveField('destination') }}
                  className={`w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none border transition-all placeholder-gray-400 ${activeField === 'destination' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {panelOpen && pickup && destination && (
              <button
                type='submit'
                className='w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all mt-2'
              >
                Find Ride
              </button>
            )}
          </form>
        </div>

        {panelOpen && (
          <div className='px-6 pb-6 overflow-y-auto' style={{ maxHeight: 'calc(100% - 280px)' }}>
            {activeField ? (
              <LocationSearchPanel
                query={activeField === 'pickup' ? pickupText : destinationText}
                onSelect={handleLocationSelect}
              />
            ) : (
              <div className='space-y-3'>
                <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2'>Saved Places</h3>
                <div className='flex items-center gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer active:bg-gray-100'>
                  <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-800'>Home</p>
                    <p className='text-xs text-gray-400'>Add your home address</p>
                  </div>
                </div>
                <div className='flex items-center gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer active:bg-gray-100'>
                  <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-800'>Work</p>
                    <p className='text-xs text-gray-400'>Add your work address</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Panel 2 — Vehicle Selection */}
      <div
        ref={vehiclePanelRef}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-20 translate-y-full overflow-hidden'
      >
        <div className='flex items-center justify-between mb-4'>
          <button onClick={() => setVehiclePanelOpen(false)} className='p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
          <div className='w-6' />
        </div>
        <VehiclePanel onSelect={handleVehicleSelect} />
      </div>

      {/* Panel 3 — Looking for Driver */}
      <div
        ref={lookingPanelRef}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-30 translate-y-full overflow-hidden'
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='w-6' />
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
          <div className='w-6' />
        </div>
        <LookingForDriver pickup={pickup?.name || ''} destination={destination?.name || ''} vehicle={selectedVehicle} onConfirm={handleConfirmRide} />
      </div>

      {/* Panel 4 — Waiting for Driver (Driver Found) */}
      <div
        ref={waitingPanelRef}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-40 translate-y-full overflow-hidden'
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='w-6' />
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
          <div className='w-6' />
        </div>
        <WaitingForDriver vehicle={selectedVehicle} />
      </div>

      {/* Panel 5 — Riding (In Progress) */}
      <div
        ref={ridingPanelRef}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-50 translate-y-full overflow-hidden'
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='w-6' />
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
          <div className='w-6' />
        </div>
        <Riding pickup={pickup?.name || ''} destination={destination?.name || ''} vehicle={selectedVehicle} onRideEnd={handleRideEnd} />
      </div>
    </div>
  )
}

export default Home
