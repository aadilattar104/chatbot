"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../components/AuthProvider"
import "../styles/auth.css"
import { getAuth } from "firebase/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const auth = getAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(email, password)

      // Check if email is verified
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        setError("Please verify your email before logging in")
        return
      }

      // Show success message
      alert("Login successful! Welcome back.")
      navigate("/dashboard")
    } catch (error) {
      // Handle specific error cases
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email")
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later")
      } else {
        setError(error.message || "Failed to log in")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
