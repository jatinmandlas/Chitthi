import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import SignUp from './pages/signup'
import getCurrentUser from './customHooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getOtherUsers from './customHooks/getOtherUsers'
import { io } from "socket.io-client"
import { serverUrl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App() {
  getCurrentUser()
  getOtherUsers()
  let { userData, socket, onlineUsers } = useSelector(state => state.user)
  let dispatch = useDispatch()

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id
        }
      })
      dispatch(setSocket(socketio))

      // 🛠️ INTERVIEW DIAGNOSTIC LOGS START HERE
      socketio.on("connect", () => {
        const startTime = Date.now();
        
        // Emit a fast signal to the backend to check network speed
        socketio.emit("ping_heartbeat", () => {
          const latency = Date.now() - startTime;
          
          console.log(`🚀 Socket Connected! ID: ${socketio.id}`);
          console.log(`📶 Network Latency (Ping): ${latency}ms`);
          console.log(`🛠️ Transport Engine: ${socketio.io.engine.transport.name.toUpperCase()}`);
        });
      });
      // 🛠️ INTERVIEW DIAGNOSTIC LOGS END HERE
        
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users))
      })
        
      return () => socketio.close()
        
    } else {
      if (socket) {
        socket.close()
        dispatch(setSocket(null))
      }
    }
  }, [userData])
  

  return (
    <Routes>
      <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/signup" />} />
    </Routes>
  )
}

export default App
