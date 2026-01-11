export const theme = {
  colors: {
    // Brand
    primary: "#FF6B35", // Main orange
    secondary: "#FDBA74", // Lighter orange for accents (e.g., badges)

    // UI Basics
    background: "#F5F5F5", // General screen background (Light Gray)
    surface: "#FFFFFF", // Card/Modal background (White)
    border: "#E0E0E0", // Divider lines

    // Typography
    text: {
      primary: "#333333", // Main text
      secondary: "#666666", // Subtitles/Captions
      light: "#FFFFFF", // Text on primary background
      inverse: "#FFFFFF",
      disabled: "#999999",
    },

    // Status (Semantic)
    status: {
      success: "#22c55e",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },

  // Spacing (8pt Grid adapted for our current usage)
  spacing: {
    xs: 8,
    sm: 12, // Tweaked to match current "padding: 12" usage
    md: 16, // Standard padding
    lg: 24,
    xl: 32,
  },

  // Radius
  radius: {
    sm: 6,
    md: 8, // Standard card radius
    lg: 12,
    xl: 16, // Large cards
    round: 9999,
  },

  // Typography sizes
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    header: 24,
    hero: 32,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

// Type helper
export type Theme = typeof theme;
