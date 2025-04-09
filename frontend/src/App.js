import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./components/AuthProvider"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Dashboard from "./pages/Dashboard"
import { createContext, useState, useEffect } from "react"
import "./App.css"

// Create theme context
export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? true : false;
  });

  useEffect(() => {
    // Apply theme class to document body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <AuthProvider>
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
          <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </ThemeContext.Provider>
      </AuthProvider>
    </Router>
  )
}

export default App