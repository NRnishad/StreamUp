import HomePage from "./pages/HomePage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import { Routes, Route, Navigate } from "react-router"




function App() {
  

  return (
    <div className="h-screen " data-theme='night'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      
    </div>
   
  )
}

export default App
