import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const  {Captain , setCaptain} = React.useContext(CaptainDataContext)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/captain-home')
    }
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    const newCaptain = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType
      }
    }

    const response = await api.post('/captain/register', newCaptain)

    if (response.status === 201) {
      const data = response.data
      localStorage.setItem('token', data.token)
      navigate('/captain-login')
    }

    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col'>

      <div className='flex-1 flex flex-col items-center justify-center px-6 py-10'>

        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight'>
            Nex<span className='text-emerald-500'>Ride</span>
          </h1>
          <p className='text-gray-400 text-sm mt-1'>Captain Portal</p>
        </div>

        <div className='w-full max-w-sm bg-white rounded-2xl shadow-lg p-7'>
          <h2 className='text-xl font-bold text-gray-800 mb-1'>Become a Captain</h2>
          <p className='text-sm text-gray-400 mb-6'>Register to start earning</p>

          <form onSubmit={submitHandler} className='space-y-4'>
            <div className='flex gap-3'>
              <div className='flex-1'>
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>First Name</label>
                <input
                  type='text'
                  required
                  placeholder='Ali'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
                />
              </div>
              <div className='flex-1'>
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>Last Name</label>
                <input
                  type='text'
                  placeholder='Khan'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
                />
              </div>
            </div>

            <div>
              <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>Email</label>
              <input
                type='email'
                required
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
              />
            </div>

            <div>
              <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>Password</label>
              <input
                type='password'
                required
                placeholder='Min 6 characters'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
              />
            </div>

            <div className='pt-2'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Vehicle Information</p>

              <div className='space-y-3'>
                <div className='flex gap-3'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      required
                      placeholder='Color'
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                      className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
                    />
                  </div>
                  <div className='flex-1'>
                    <input
                      type='text'
                      required
                      placeholder='Plate No.'
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
                    />
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='flex-1'>
                    <input
                      type='number'
                      required
                      min='1'
                      placeholder='Capacity'
                      value={vehicleCapacity}
                      onChange={(e) => setVehicleCapacity(e.target.value)}
                      className='w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all'
                    />
                  </div>
                  <div className='flex-1'>
                    <select
                      required
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className='w-full bg-gray-50 rounded-xl px-4 py-3 pr-8 text-sm outline-none border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%3E%3Cpath%20fill=%27%236b7280%27%20d=%27M6%208L1%203h10z%27/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_12px_center] bg-no-repeat'
                    >
                      <option value='' disabled>Type</option>
                      <option value='car'>Car</option>
                      <option value='motorcycle'>Motorcycle</option>
                      <option value='auto'>Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all mt-2'
            >
              Register as Captain
            </button>
          </form>

          <p className='text-center mt-5 text-sm text-gray-400'>
            Already a captain?{' '}
            <Link to='/captain-login' className='text-emerald-600 font-semibold hover:underline'>Sign In</Link>
          </p>
        </div>
      </div>

      <div className='px-6 pb-8 pt-4 w-full max-w-sm mx-auto'>
        <Link
          to='/signup'
          className='flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all'
        >
          Register as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainSignup
