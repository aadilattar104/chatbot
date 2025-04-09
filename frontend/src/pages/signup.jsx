"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../components/AuthProvider"
import "../styles/auth.css"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  // Replace the handleSubmit function with this updated version
  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(email, password)
      setVerificationSent(true)
      // Show success message
      alert("Registration successful! Please check your email to verify your account.")
    } catch (error) {
      // Handle specific error cases
      if (error.code === "auth/email-already-in-use") {
        setError("Email already registered. Please use a different email or try logging in")
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address")
      } else {
        setError(error.message || "Failed to create an account")
      }
    } finally {
      setLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Verification Email Sent</h2>
          <p>
            A verification email has been sent to <strong>{email}</strong>. Please check your inbox and verify your
            email before logging in.
          </p>
          <button className="auth-button" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
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
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
