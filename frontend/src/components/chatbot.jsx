"use client"

import { useState, useEffect, useRef } from "react"
import "../styles/chatbot.css"

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    // Focus input field when component mounts
    inputRef.current?.focus()
  }, [messages])

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        text: "Hi there! I'm Gemini AI. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call Flask backend API
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Extract just the response text without the "Gemini Chatbot: " prefix
      let botResponse = data.response
      if (botResponse.startsWith("Gemini Chatbot: ")) {
        botResponse = botResponse.substring("Gemini Chatbot: ".length)
      }

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: botResponse,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching from chatbot API:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "bot",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-header">
  <div className="chatbot-status">
    <span className="status-indicator online"></span>
    <span className="status-text">Online</span>
  </div>
</div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-container ${message.sender === "user" ? "user-container" : "bot-container"}`}
          >
            {message.sender === "bot" && (
              <div className="message-avatar">
                <span>AI</span>
              </div>
            )}
            <div className={`message ${message.sender} ${message.isError ? "error" : ""}`}>
              <div className="message-text">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-container bot-container">
            <div className="message-avatar">
              <span>AI</span>
            </div>
            <div className="message bot loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="chatbot-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || input.trim() === ""}
          className="send-button"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Chatbot
