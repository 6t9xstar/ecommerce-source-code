/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './admin/*.html',
    './js/**/*.ts',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'pure-black': '#000000',
        'pure-white': '#FFFFFF',
        'crown-glass': 'rgba(255, 255, 255, 0.03)',
        'crown-border': 'rgba(255, 255, 255, 0.1)',
        'crown-muted': 'rgba(255, 255, 255, 0.4)',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'crown-reveal': 'crownReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        crownReveal: {
          '0%': { transform: 'scale(0.95) translateY(20px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
        'monochrome-glow': 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
