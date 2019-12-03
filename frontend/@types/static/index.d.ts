const url: string

declare module '*.svg' {
  export default url
}

declare module '*.graphql'

declare module '*.gql'

declare module '*.png' {
  export default url
}

declare module '*.md' {
  import { ComponentElement } from 'react'

  export const attributes: { [key: string]: any }

  export const react: ComponentElement
}
