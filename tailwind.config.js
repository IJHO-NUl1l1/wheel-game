module.exports = {
  theme: {
    extend: {
      keyframes: {
        'spin-wheel': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(1440deg)' }
        }
      },
      animation: {
        'spin-wheel': 'spin-wheel 5.2s cubic-bezier(0, 0, 0.35, 1.02)'
      }
    }
  }
} 