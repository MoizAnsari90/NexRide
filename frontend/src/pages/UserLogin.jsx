import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { UserDataContext } from '../context/UserContext'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/home')
    }
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()

    const response = await api.post('/users/login', { email, password })

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col'>

      {/* Top Section */}
      <div className='flex-1 flex flex-col items-center justify-center px-6'>

        {/* Logo */}
        <div className='mb-10 text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight'>
            Nex<span className='text-emerald-500'>Ride</span>
          </h1>
          <p className='text-gray-400 text-sm mt-1'>Move smarter, arrive faster</p>
        </div>

        {/* Card */}
        <div className='w-full max-w-sm bg-white rounded-2xl shadow-lg p-7'>
          <h2 className='text-xl font-bold text-gray-800 mb-1'>Welcome back</h2>
          <p className='text-sm text-gray-400 mb-6'>Sign in to continue your ride</p>

          <form onSubmit={submitHandler} className='space-y-4'>
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

            <button
              type='submit'
              className='w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all mt-2'
            >
              Sign In
            </button>
          </form>

          <p className='text-center mt-5 text-sm text-gray-400'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-emerald-600 font-semibold hover:underline'>Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Bottom Captain Button */}
      <div className='px-6 pb-8 pt-4 w-full max-w-sm mx-auto'>
        <Link
          to='/captain-login'
          className='flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/25'
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin