import React, { createContext, useContext, useState, useEffect } from "react";

// Define the neon dark theme
const neonDarkTheme = {
  colors: {
    // Background Colors
    void: "#000000",
    surface: "#0A0A0F",
    card: "#1A1A2E",

    // Text Colors
    primary: "#FFFFFF",
    secondary: "#E2E8F0",
    muted: "#94A3B8",

    // Neon Accent Colors
    neonCyan: "#00FFFF",
    neonPurple: "#8A2BE2",
    neonPink: "#FF1493",
    neonGold: "#FFD700",
    electricBlue: "#0080FF",

    // Semantic Colors
    success: "#00FF85",
    warning: "#FFB800",
    error: "#FF4757",
    info: "#00FFFF",

    // Gradient Combinations
    gradients: {
      primary: "linear-gradient(45deg, #00FFFF, #8A2BE2)",
      secondary: "linear-gradient(45deg, #FF1493, #FFD700)",
      electric: "linear-gradient(45deg, #00FFFF, #0080FF)",
      sunset: "linear-gradient(45deg, #FF1493, #FFD700, #00FFFF)",
      cosmic: "linear-gradient(135deg, #8A2BE2, #FF1493, #00FFFF)",
    },

    // Shadow Colors
    shadows: {
      cyan: "0 0 20px rgba(0, 255, 255, 0.5)",
      purple: "0 0 20px rgba(138, 43, 226, 0.5)",
      pink: "0 0 20px rgba(255, 20, 147, 0.5)",
      gold: "0 0 20px rgba(255, 215, 0, 0.5)",
      multi: "0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(138, 43, 226, 0.2)",
    },
  },

  typography: {
    fontFamily: {
      primary: "'Orbitron', 'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
  },

  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "1000ms",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

// Light theme variant
const neonLightTheme = {
  ...neonDarkTheme,
  colors: {
    ...neonDarkTheme.colors,
    void: "#F8FAFC",
    surface: "#FFFFFF",
    card: "#F1F5F9",
    primary: "#0F172A",
    secondary: "#334155",
    muted: "#64748B",
  },
};

// Types
export interface Theme {
  colors: typeof neonDarkTheme.colors;
  typography: typeof neonDarkTheme.typography;
  animations: typeof neonDarkTheme.animations;
}

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: Theme['colors'];
  typography: Theme['typography'];
  animations: Theme['animations'];
}

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const currentTheme = isDarkMode ? neonDarkTheme : neonLightTheme;

  // Apply CSS custom properties to document root
  useEffect(() => {
    const root = document.documentElement;

    // Set CSS variables for the theme
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      if (typeof value === "string") {
        root.style.setProperty(`--color-${key}`, value);
      }
    });

    // Set body class for theme
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [currentTheme, isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const value: ThemeContextType = {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    animations: currentTheme.animations,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme utility functions
export const themeUtils = {
  getColor: (colorKey: keyof typeof neonDarkTheme.colors, opacity = 1): string => {
    const color = neonDarkTheme.colors[colorKey];
    if (typeof color !== 'string') return '';
    if (opacity === 1) return color;

    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  createGlow: (color: string, intensity: 'light' | 'medium' | 'strong' | 'ultra' = 'medium'): string => {
    const intensityMap = {
      light: "0 0 10px",
      medium: "0 0 20px",
      strong: "0 0 40px",
      ultra: "0 0 20px, 0 0 40px, 0 0 60px",
    };
    return `${intensityMap[intensity]} ${color}`;
  },

  createGradient: (direction = "45deg", ...colors: string[]): string => {
    return `linear-gradient(${direction}, ${colors.join(", ")})`;
  },
};

// Neon color constants export
export const NEON_COLORS = {
  VOID: "#000000",
  SURFACE: "#0A0A0F",
  CARD: "#1A1A2E",
  PRIMARY_TEXT: "#FFFFFF",
  SECONDARY_TEXT: "#E2E8F0",
  MUTED_TEXT: "#94A3B8",
  NEON_CYAN: "#00FFFF",
  NEON_PURPLE: "#8A2BE2",
  NEON_PINK: "#FF1493",
  NEON_GOLD: "#FFD700",
  ELECTRIC_BLUE: "#0080FF",
  SUCCESS: "#00FF85",
  WARNING: "#FFB800",
  ERROR: "#FF4757",
  INFO: "#00FFFF",
} as const;

export { neonDarkTheme, neonLightTheme };
