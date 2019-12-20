import resolve from 'tailwindcss/resolveConfig'
import tailwind from '../../tailwind.config'

const { theme } = resolve(tailwind) as {
  theme: {
    colors: {
      primary: string
      white: string
    }
  }
}

export { theme }
