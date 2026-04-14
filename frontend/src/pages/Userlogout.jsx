import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Userlogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    api.get('/users/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.status === 200) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }).catch(() => {
      localStorage.removeItem('token')
      navigate('/login')
    })
  }, [navigate])

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-white'>
      <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black'></div>
    </div>
  )
}

export default Userlogout
