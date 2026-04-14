import React, { useContext } from 'react'
import {Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/captainLogin'
import CaptainSignup from './pages/CaptainSignup' 
import { UserDataContext } from './context/UserContext'
import Start from './pages/Start'
import UserProtectWrapper from './pages/UserProtectWrapper'
import Userlogout from './pages/Userlogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import CaptainPickupMap from './pages/CaptainPickupMap'


const App = () => {
  const ans = useContext(UserDataContext)

  return (
    <Routes>
        <Route path="/" element={<Start/>}/>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/signup" element={<UserSignup/>}/>
        <Route path="/captain-login" element={<CaptainLogin/>}/>
        <Route path="/captain-signup" element={<CaptainSignup/>}/>
        <Route path="/captain-home" element={
          <CaptainProtectWrapper>
            <CaptainHome/>
          </CaptainProtectWrapper>}/>
        <Route path="/home" element={
          <UserProtectWrapper>
            <Home/>
          </UserProtectWrapper>}/>
          <Route path='/userlogout' element={<Userlogout/>}/>
          <Route path='/riding' element={
            <UserProtectWrapper>
              <Riding/>
            </UserProtectWrapper>
          }/>
          <Route path='/captain-riding' element={
            <CaptainProtectWrapper>
              <CaptainRiding/>
            </CaptainProtectWrapper>
          }/>
          <Route path='/captain-pickup-map' element={
            <CaptainProtectWrapper>
              <CaptainPickupMap/>
            </CaptainProtectWrapper>
          }/>
    </Routes>
  )
}

export default App