import resolve from 'tailwindcss/resolveConfig'
import tailwind from '../../tailwind.config'

const { theme } = resolve(tailwind) as {
  theme: {
    colors: {
      white: string
    }
  }
}

export { theme }
