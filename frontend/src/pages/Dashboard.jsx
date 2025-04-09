"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../components/AuthProvider"
import { ThemeContext } from "../App"
import Chatbot from "../components/chatbot"
import "../styles/dashboard.css"

export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Check if user is logged in and email is verified
    if (!currentUser || !currentUser.emailVerified) {
      navigate("/login")
    } else {
      // Show welcome message as a text book style
      setShowWelcome(true)
    }

    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentUser, navigate])

  async function handleLogout() {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gemini AI Chatbot</h1>
        <div className="header-controls">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle dark mode">
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {showWelcome && (
        <div className="welcome-message text-book">
          <h2>Welcome to the Chatbot!</h2>
          <p>You are now logged in as {currentUser?.email}</p>
          <p className="success-message">Login Successful!</p>
          <p>You can now chat with Gemini AI. Just type your message and press Enter.</p>
        </div>
      )}

      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  )
}