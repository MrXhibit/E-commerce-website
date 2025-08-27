import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#f8fafc",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        primary: {
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // New color palette matching the design
        darkBlue: {
          100: "#e2e8f0",
          200: "#cbd5e1",
          300: "#94a3b8",
          400: "#64748b",
          500: "#475569",
          600: "#334155",
          700: "#1e293b",
          800: "#0f172a",
          900: "#020617",
        },
        sidebar: {
          main: "#212B36",
          light: "#2D3748",
          dark: "#1A1D29",
        },
        card: {
          main: "#2D3748",
          light: "#374151",
          dark: "#1F2937",
        },
        greenAccent: {
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        redAccent: {
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        blueAccent: {
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        orangeAccent: {
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        purpleAccent: {
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        pinkAccent: {
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        darkBlue: {
          100: "#020617",
          200: "#0f172a",
          300: "#1e293b",
          400: "#334155",
          500: "#475569",
          600: "#64748b",
          700: "#94a3b8",
          800: "#cbd5e1",
          900: "#e2e8f0",
        },
        sidebar: {
          main: "#f8fafc",
          light: "#e2e8f0",
          dark: "#cbd5e1",
        },
        card: {
          main: "#ffffff",
          light: "#f8fafc",
          dark: "#f1f5f9",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
        orangeAccent: {
          100: "#7c2d12",
          200: "#9a3412",
          300: "#c2410c",
          400: "#ea580c",
          500: "#f97316",
          600: "#fb923c",
          700: "#fdba74",
          800: "#fed7aa",
          900: "#ffedd5",
        },
        purpleAccent: {
          100: "#581c87",
          200: "#6b21a8",
          300: "#7c3aed",
          400: "#9333ea",
          500: "#a855f7",
          600: "#c084fc",
          700: "#d8b4fe",
          800: "#e9d5ff",
          900: "#f3e8ff",
        },
        pinkAccent: {
          100: "#831843",
          200: "#9d174d",
          300: "#be185d",
          400: "#db2777",
          500: "#ec4899",
          600: "#f472b6",
          700: "#f9a8d4",
          800: "#fbcfe8",
          900: "#fce7f3",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.blueAccent[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.darkBlue[900],
              paper: colors.card.main,
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[400],
            },
            sidebar: {
              main: colors.sidebar.main,
              light: colors.sidebar.light,
              dark: colors.sidebar.dark,
            },
            card: {
              main: colors.card.main,
              light: colors.card.light,
              dark: colors.card.dark,
            },
          }
        : {
            primary: {
              main: colors.blueAccent[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
              paper: colors.card.main,
            },
            text: {
              primary: colors.grey[900],
              secondary: colors.grey[600],
            },
            sidebar: {
              main: colors.sidebar.main,
              light: colors.sidebar.light,
              dark: colors.sidebar.dark,
            },
            card: {
              main: colors.card.main,
              light: colors.card.light,
              dark: colors.card.dark,
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 700,
      },
      h2: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 28,
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 600,
      },
      h5: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 18,
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
      },
      body2: {
        fontSize: 12,
        fontWeight: 400,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? colors.card.main : colors.card.main,
            borderRadius: 12,
            boxShadow: mode === "dark" 
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  };
};
