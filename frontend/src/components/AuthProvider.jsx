"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth"
import { auth } from "../firebase"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Send email verification
      return sendEmailVerification(userCredential.user)
    })
  }

  // Update the login function to handle email verification check
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email before logging in")
      }
      return userCredential
    })
  }

  function logout() {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
