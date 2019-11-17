import resolve from 'tailwindcss/resolveConfig'
import tailwind from '../../tailwind'

const { theme } = resolve(tailwind) as {
  theme: {
    colors: {}
  }
}

export { theme }
