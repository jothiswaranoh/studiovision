/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background Colors
        void: '#000000',
        surface: '#0A0A0F',
        card: '#1A1A2E',

        // Neon Accent Colors
        neon: {
          cyan: '#00FFFF',
          purple: '#8A2BE2',
          pink: '#FF1493',
          gold: '#FFD700',
        },
        electric: {
          blue: '#0080FF',
        },

        // Semantic Colors
        success: '#00FF85',
        warning: '#FFB800',
        error: '#FF4757',
        info: '#00FFFF',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(138, 43, 226, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 20, 147, 0.5)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'neon-multi': '0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(138, 43, 226, 0.2)',
        'glow-sm': '0 0 10px currentColor',
        'glow-md': '0 0 20px currentColor',
        'glow-lg': '0 0 40px currentColor',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(45deg, #00FFFF, #8A2BE2)',
        'gradient-secondary': 'linear-gradient(45deg, #FF1493, #FFD700)',
        'gradient-electric': 'linear-gradient(45deg, #00FFFF, #0080FF)',
        'gradient-sunset': 'linear-gradient(45deg, #FF1493, #FFD700, #00FFFF)',
        'gradient-cosmic': 'linear-gradient(135deg, #8A2BE2, #FF1493, #00FFFF)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'hologram-scan': 'hologram-scan 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%': { filter: 'drop-shadow(0 0 5px currentColor)' },
          '100%': { filter: 'drop-shadow(0 0 20px currentColor) drop-shadow(0 0 30px currentColor)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'hologram-scan': {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
