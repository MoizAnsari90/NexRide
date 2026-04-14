import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserContext"
import api from "../api/axios"

const UserProtectWrapper = ({ children }) => {
    const navigate = useNavigate()
    const { setUser } = useContext(UserDataContext)
    const [isLoading, setIsLoading] = useState(true)

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        api.get('/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setUser(response.data)
                setIsLoading(false)
            }
        }).catch(() => {
            localStorage.removeItem('token')
            navigate('/login')
        })
    }, [token])

    if (isLoading) {
        return (
            <div className='h-screen w-screen flex items-center justify-center bg-white'>
                <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black'></div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper
