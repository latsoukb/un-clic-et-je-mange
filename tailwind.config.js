/** Palette issue de la maquette Stitch (« Warm Culinary Companion »). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#fbf9f5', 'surface-low': '#f5f3ef', 'surface-mid': '#efeeea', 'surface-high': '#e4e2de',
        ink: '#1b1c1a', 'ink-soft': '#594137', line: '#efe8de',
        primary: '#9f3d00', 'primary-soft': '#ffdbcd', flame: '#e85d04',
        sage: '#376847', 'sage-soft': '#b6edc2', amber: '#8a4d00', 'amber-soft': '#ffdcc1',
        danger: '#ba1a1a', 'danger-soft': '#ffdad6'
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 4px 16px -2px rgba(85,60,40,.06), 0 2px 6px -1px rgba(85,60,40,.03)' }
    }
  },
  plugins: []
}
