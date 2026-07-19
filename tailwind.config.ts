import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        void2: '#0a0a0a',
        void3: '#111111',
        void4: '#1a1a1a',
        void5: '#222222',
        void6: '#2a2a2a',
        void7: '#333333',
        void8: '#444444',
        void9: '#555555',
        void10: '#666666',
        void11: '#777777',
        void12: '#888888',
        void13: '#999999',
        void14: '#aaaaaa',
        void15: '#bbbbbb',
        void16: '#cccccc',
        void17: '#dddddd',
        void18: '#eeeeee',
        void19: '#ffffff',
        neon: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          green: '#22c55e',
          purple: '#a855f7',
          pink: '#ec4899',
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
        },
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
