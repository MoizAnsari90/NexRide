import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CaptainDataContext } from "../context/CaptainContext"
import api from "../api/axios"

const CaptainProtectWrapper = ({ children }) => {
    const navigate = useNavigate()
    const { setCaptain } = useContext(CaptainDataContext)
    const [isLoading, setIsLoading] = useState(true)

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
            return
        }

        api.get('/captain/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain || response.data)
                setIsLoading(false)
            }
        }).catch(() => {
            localStorage.removeItem('token')
            navigate('/captain-login')
        })
    }, [token])

    if (isLoading) {
        return (
            <div className='h-screen w-screen flex items-center justify-center bg-white'>
                <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-emerald-500'></div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper
