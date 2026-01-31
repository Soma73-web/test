import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiLock, FiUser, FiShield, FiCheck } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// Password strength meter
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (!password) return { level: 0, text: "", color: "" };
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    const levels = [
      { level: 0, text: "Weak", color: "bg-red-500" },
      { level: 1, text: "Fair", color: "bg-orange-500" },
      { level: 2, text: "Good", color: "bg-yellow-500" },
      { level: 3, text: "Strong", color: "bg-blue-500" },
      { level: 4, text: "Very Strong", color: "bg-green-500" },
      { level: 5, text: "Excellent", color: "bg-emerald-500" },
    ];
    
    return levels[Math.min(strength, 5)];
  };

  const strength = getStrength();
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < strength.level ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>
        {strength.text}
      </p>
    </div>
  );
};

// 3D Background Animation
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 300;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
      }

      update() {
        this.z -= this.speed;
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.z <= 0) {
          this.z = 300;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const scale = this.z / 300;
        const size = this.size * scale;
        const opacity = this.opacity * scale;

        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
    />
  );
};

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const navigate = useNavigate();

  // Load saved credentials and check lockout status
  useEffect(() => {
    const savedCredentials = localStorage.getItem("savedStudentCredentials");
    if (savedCredentials) {
      try {
        const { studentId } = JSON.parse(savedCredentials);
        setFormData((prev) => ({ ...prev, studentId }));
        setRememberMe(true);
      } catch (error) {
        console.error("Error loading saved credentials:", error);
      }
    }

    // Check if account is locked
    const lockoutExpiry = localStorage.getItem("studentLockoutExpiry");
    if (lockoutExpiry && new Date().getTime() < parseInt(lockoutExpiry)) {
      setIsLocked(true);
      const remaining = Math.ceil((parseInt(lockoutExpiry) - new Date().getTime()) / 1000);
      setLockoutTime(remaining);
    }
  }, []);

  // Lockout timer
  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setLoginAttempts(0);
          localStorage.removeItem("studentLockoutExpiry");
          localStorage.removeItem("loginAttempts");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInput = () => {
    if (!formData.studentId.trim()) {
      toast.error("Student ID is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.studentId.length < 3) {
      toast.error("Student ID must be at least 3 characters");
      return false;
    }
    if (formData.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.error(
        `Too many login attempts. Please try again in ${lockoutTime} seconds.`
      );
      return;
    }

    if (!validateInput()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/students/login`, {
        studentId: formData.studentId.trim(),
        password: formData.password,
      });

      // Reset login attempts on success
      setLoginAttempts(0);
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("studentLockoutExpiry");

      // Store token and student info
      localStorage.setItem("studentToken", response.data.token);
      localStorage.setItem(
        "studentInfo",
        JSON.stringify(response.data.student)
      );

      // Store credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem(
          "savedStudentCredentials",
          JSON.stringify({ studentId: formData.studentId.trim() })
        );
      } else {
        localStorage.removeItem("savedStudentCredentials");
      }

      // Store login timestamp for session management
      localStorage.setItem("loginTimestamp", new Date().getTime().toString());

      toast.success("Welcome! Logging you in...");
      
      // Small delay for animation
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);

      // Handle rate limiting
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts.toString());

      if (newAttempts >= 5) {
        const lockoutDuration = 5 * 60 * 1000; // 5 minutes
        const lockoutExpiry = new Date().getTime() + lockoutDuration;
        localStorage.setItem("studentLockoutExpiry", lockoutExpiry.toString());
        setIsLocked(true);
        setLockoutTime(300);
        toast.error("Too many login attempts. Account locked for 5 minutes.");
        return;
      }

      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
      
      toast.info(`Attempts remaining: ${5 - newAttempts}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* 3D Card Container */}
        <div className="perspective">
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-opacity-95 transition-all duration-300 hover:shadow-3xl border border-blue-100"
            style={{
              transform: "translateZ(0px)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Student Portal
              </h2>
              <p className="text-gray-600 text-sm">
                Access your NEET coaching dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student ID Input */}
              <div className="group">
                <label
                  htmlFor="studentId"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Student ID
                  </span>
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={isLocked}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., NEET2024001"
                  autoComplete="username"
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLocked}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>

              {/* Remember Me & Security Badge */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLocked}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800">
                    Remember me
                  </span>
                </label>
                <a
                  href="/contact"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Forgot password?
                </a>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <FiCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700">
                  Secure connection • Data encrypted
                </span>
              </div>

              {/* Lock Out Warning */}
              {isLocked && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">
                    Account temporarily locked due to multiple failed attempts.
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Try again in {lockoutTime} seconds
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <FiShield className="w-5 h-5" />
                    Login to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Support Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="/contact"
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Contact Support
                </a>
              </p>
              <p className="text-center text-xs text-gray-500 mt-2">
                By logging in, you agree to our terms and privacy policy
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-blue-100">
          <p>🔒 Your data is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
