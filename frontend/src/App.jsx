import HomePage from "./pages/HomePage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import { Routes, Route, Navigate } from "react-router"
import {Toaster} from 'react-hot-toast'
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"



function App() {
 
      const {isLoading,authUser}=useAuthUser()
      const isAuthenticated = Boolean(authUser)
      const isOnboarded = authUser?.isOnboarded
      if(isLoading) return <PageLoader/>

  return (
    <div className="h-screen " data-theme='night'>
     
      <Routes>
        <Route path="/" element={isAuthenticated&&isOnboarded?(<HomePage />):(<Navigate to={!isAuthenticated ? "/login":"/onboarding"}/>)} />
        <Route path="/login" element={!isAuthenticated?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/signup" element={!isAuthenticated?<SignUpPage />:<Navigate to="/"/>} />
        <Route path="/chat" element={isAuthenticated?<ChatPage />:<Navigate to="/login"/>} />
        <Route path="/notifications" element={isAuthenticated?<NotificationsPage />:<Navigate to="/login"/>} />
        <Route path="/onboarding" element={isAuthenticated?(!isOnboarded ?(<OnboardingPage />):(<Navigate to="/"/>)):(<Navigate to="/login"/>)} />
        <Route path="/call" element={isAuthenticated?<CallPage />:<Navigate to="/login"/>} />
        <Route path="*" element={isAuthenticated?<Navigate to="/" replace />:<Navigate to="/login"/>} />
      </Routes>

      <Toaster/>
    </div>
   
  )
}

export default App
