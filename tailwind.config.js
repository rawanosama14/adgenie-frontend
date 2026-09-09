/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './features/**/*.{js,jsx}', './providers/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'},
        accent: {50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87'},
        sunshine: {50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207'}
      },
      fontFamily: { sans: ['Segoe UI Variable','Segoe UI','Cairo','Tajawal','Inter','system-ui','sans-serif'] },
      boxShadow: { soft:'0 15px 35px -15px rgba(37, 99, 235, 0.35)', card:'0 4px 20px -8px rgba(15, 23, 42, 0.12)' },
      animation: { 'fade-in':'fadeIn .5s ease-out both','slide-up':'slideUp .5s ease-out both',float:'float 5s ease-in-out infinite',blob:'blob 8s ease-in-out infinite' },
      keyframes: {
        fadeIn:{'0%':{opacity:'0'},'100%':{opacity:'1'}},
        slideUp:{'0%':{opacity:'0',transform:'translateY(18px)'},'100%':{opacity:'1',transform:'translateY(0)'}},
        float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-14px)'}},
        blob:{'0%,100%':{transform:'translate(0,0) scale(1)'},'33%':{transform:'translate(24px,-30px) scale(1.08)'},'66%':{transform:'translate(-18px,16px) scale(.94)'}}
      }
    }
  },
  plugins: []
};
