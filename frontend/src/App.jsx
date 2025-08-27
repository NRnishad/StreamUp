import HomePage from "./pages/HomePage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import { Routes, Route, Navigate } from "react-router"

import {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios.js"



function App() {
  const {data:authData,isLoading} = useQuery({
      queryKey: ['authUser'],
      queryFn: async () => {
        const res = await axiosInstance.get('/auth/me')
        return res.data
      }, retry: false,})
      console.log()
      const authUser = authData?.user || null
      if(isLoading) return <PageLoader/>
  return (
    <div className="h-screen " data-theme='night'>
     
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login"/>} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
        <Route path="/chat" element={authUser?<ChatPage />:<Navigate to="/login"/>} />
        <Route path="/notifications" element={authUser?<NotificationsPage />:<Navigate to="/login"/>} />
        <Route path="/onboarding" element={authUser?<OnboardingPage />:<Navigate to="/login"/>} />
        <Route path="/call" element={authUser?<CallPage />:<Navigate to="/login"/>} />
        <Route path="*" element={authUser?<Navigate to="/" replace />:<Navigate to="/login"/>} />
      </Routes>

      <Toaster/>
    </div>
   
  )
}

export default App
