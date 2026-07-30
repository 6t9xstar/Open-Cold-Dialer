/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-blue-50", "text-blue-600",
    "bg-emerald-50", "text-emerald-600",
    "bg-amber-50", "text-amber-600",
    "bg-green-50", "text-green-600",
    "bg-purple-50", "text-purple-600",
    "bg-brand-50", "text-brand-600",
    "bg-brand-100", "text-brand-600",
    "bg-red-500",
    "bg-blue-500",
    "bg-amber-500",
    "bg-gray-400",
    "bg-green-500",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
