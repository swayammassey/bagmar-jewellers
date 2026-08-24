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
        cormorant: ['Marcellus', 'serif'],
        serif: ['Marcellus', 'serif'],
        jost: ['Jost', 'sans-serif'],
        sans: ['Jost', 'sans-serif'],
      },
      colors: {
        ivory: '#FAF9F6',
        cream: '#F3F0E6',
        gold: {
          light: '#E5C158',
          DEFAULT: '#C5A059',
          dark: '#A67C00',
        },
        wine: {
          DEFAULT: '#722F37',
          dark: '#5A252C',
        },
        ink: '#1A1A1A',
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
