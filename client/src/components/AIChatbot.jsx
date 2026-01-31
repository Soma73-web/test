import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSpinner,
  FaComment,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import api from "../api";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your NEET Academy AI assistant. I can help you with NEET preparation questions, study tips, and exam strategies. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const location = useLocation();

  // Check if chatbot should be hidden on certain pages
  const shouldHideChatbot = useCallback(() => {
    const hiddenPaths = [
      "/results",
      "/student-dashboard",
      "/admin",
      "/admin-login",
    ];
    return hiddenPaths.some((path) => location.pathname.startsWith(path));
  }, [location.pathname]);

  // Check if user is a student
  const isStudentLoggedIn = useCallback(() => {
    return (
      localStorage.getItem("studentToken") &&
      localStorage.getItem("studentInfo")
    );
  }, []);

  const checkConfiguration = useCallback(async () => {
    try {
      const response = await api.get("/api/chatbot/health");
      setIsConfigured(response.data.is_configured || response.data.openai_configured);
    } catch (error) {
      console.error("Error checking chatbot configuration:", error);
      setIsConfigured(false);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    checkConfiguration();

    // Show welcome animation when student logs in
    if (isStudentLoggedIn() && !hasInteracted) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        setIsTyping(true);
        const typingTimer = setTimeout(() => {
          setIsTyping(false);
          setShowWelcome(false);
        }, 3000);
        return () => clearTimeout(typingTimer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [checkConfiguration, isStudentLoggedIn, hasInteracted]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isLoading) return;

    setHasInteracted(true);
    const userMessage = {
      id: Date.now(),
      text: currentMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/chatbot/ask", {
        question: userMessage.text,
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      let errorText = "Sorry, I encountered an error. Please try again later.";
      
      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes("API key")) {
          errorText = "AI service is currently unavailable. Please contact support.";
        } else if (errorMessage.includes("model")) {
          errorText = "AI model is temporarily unavailable. Please try again in a few minutes.";
        } else {
          errorText = errorMessage;
        }
      } else if (error.code === "NETWORK_ERROR") {
        errorText = "Network error. Please check your internet connection and try again.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, isLoading]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleChatbot = useCallback(() => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
    setShowWelcome(false);
  }, [isOpen]);

  // Don't render if not configured or should be hidden
  if (isConfigured === false || shouldHideChatbot()) {
    return null;
  }

  // Show loading state while checking configuration
  if (isConfigured === null) {
    return null;
  }

  return (
    <>
      {/* Welcome Bubble Animation */}
      {showWelcome && !isOpen && (
        <div className="fixed bottom-32 left-6 bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-lg z-50 max-w-xs animate-bounce">
          <div className="flex items-center gap-2">
            {isTyping ? (
              <>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm ml-2">Typing...</span>
              </>
            ) : (
              <>
                <FaComment className="text-lg" />
                <span className="text-sm">
                  {isStudentLoggedIn()
                    ? "Hi! Need help with your studies? I'm here to assist! 📚"
                    : "Hi! How can I help you with NEET preparation today? 🎯"}
                </span>
              </>
            )}
          </div>
          {/* Speech bubble tail */}
          <div className="absolute bottom-0 left-6 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600"></div>
          </div>
        </div>
      )}

      {/* Chatbot Widget */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 bg-white rounded-lg shadow-xl border border-gray-200 w-96 h-96 z-50 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaRobot className="text-2xl" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-semibold">NEET AI Assistant</span>
                <div className="text-xs opacity-90">
                  {isStudentLoggedIn()
                    ? "Your study companion is online! 🚀"
                    : "Ask me about NEET preparation!"}
                </div>
              </div>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200 transition-colors hover:rotate-90 transform duration-300"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {/* Welcome message for students */}
            {isStudentLoggedIn() && !hasInteracted && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 p-3 rounded-lg max-w-[80%] border border-blue-200">
                  <div className="text-sm">
                    🎓 Welcome back, student! I can help you with:
                    <ul className="mt-2 text-xs space-y-1">
                      <li>• Study schedules & tips</li>
                      <li>• NEET exam strategies</li>
                      <li>• Subject-wise guidance</li>
                      <li>• Doubt clarification</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg animate-fade-in ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                      : message.isError
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-lg flex items-center gap-2 border border-gray-200 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isStudentLoggedIn()
                    ? "Ask me anything about your studies..."
                    : "Ask me about NEET preparation..."
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40 group"
        aria-label="Open AI Chatbot"
        title={
          isStudentLoggedIn()
            ? "Chat with AI Study Assistant"
            : "Ask NEET Questions"
        }
      >
        <FaRobot className="text-2xl group-hover:animate-bounce" />

        {/* Notification dot for new users */}
        {!hasInteracted && !showWelcome && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        )}
      </button>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
