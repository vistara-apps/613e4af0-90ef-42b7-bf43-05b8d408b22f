/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 36%, 96%)',
        accent: 'hsl(350, 80%, 60%)',
        border: 'hsl(210, 15%, 77%)',
        primary: 'hsl(204, 94%, 48%)',
        surface: 'hsl(0, 0%, 100%)',
        textPrimary: 'hsl(210, 15%, 17%)',
        textSecondary: 'hsl(210, 15%, 37%)',
        dark: {
          bg: 'hsl(220, 13%, 18%)',
          surface: 'hsl(220, 13%, 22%)',
          border: 'hsl(220, 13%, 35%)',
          text: 'hsl(0, 0%, 95%)',
          textSecondary: 'hsl(0, 0%, 70%)',
        },
        cyan: {
          400: 'hsl(180, 100%, 70%)',
          500: 'hsl(180, 100%, 50%)',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      spacing: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
