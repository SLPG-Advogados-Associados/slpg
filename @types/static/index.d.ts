const url: string
const Obj: { [key: string]: any }

declare module '*.svg' {
  export default url
}

declare module '*.graphql'

declare module '*.gql'

declare module '*.png' {
  export default url
}

declare module '*.jpg' {
  export default url
}

declare module '*.yml' {
  export default Obj
}

declare module '*.md' {
  export const attributes: Obj

  export const body: string
}
