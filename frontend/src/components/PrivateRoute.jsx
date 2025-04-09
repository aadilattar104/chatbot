"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!currentUser || !currentUser.emailVerified) {
    return <Navigate to="/login" />
  }

  return children
}
