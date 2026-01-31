module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        bounce: "bounce 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          from: {
            opacity: "0",
            transform: "scale(0.8) translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        bounce: {
          "0%, 20%, 53%, 80%, 100%": {
            transform: "translate3d(0, 0, 0)",
          },
          "40%, 43%": {
            transform: "translate3d(0, -8px, 0)",
          },
          "70%": {
            transform: "translate3d(0, -4px, 0)",
          },
          "90%": {
            transform: "translate3d(0, -2px, 0)",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
