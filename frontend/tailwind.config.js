/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Marcellus', 'serif'],
        marcellus: ['Marcellus', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        serif: ['Marcellus', 'serif'],
        jost: ['Jost', 'sans-serif'],
        sans: ['Jost', 'sans-serif'],
      },
      colors: {
        ivory: '#FFFFFF',
        cream: '#F7F5F3',
        gold: {
          light: '#DCC789',
          DEFAULT: '#B3944F',
          dark: '#8B7135',
        },
        wine: {
          DEFAULT: '#58283C',
          dark: '#3F1C2C',
          light: '#F3EAEE',
        },
        ink: '#241D20',
        emerald: {
          DEFAULT: '#58283C',
          dark: '#3F1C2C',
          light: '#F3EAEE',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
