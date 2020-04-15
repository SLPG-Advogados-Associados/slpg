import { useEffect, DependencyList } from 'react'

const useConfirmUnload = (
  shouldBlock: (event: BeforeUnloadEvent) => boolean = () => true,
  deps: DependencyList = []
) => {
  useEffect(() => {
    const listener = (event: BeforeUnloadEvent) => {
      if (shouldBlock(event)) {
        event.preventDefault()
        event.returnValue = true
        return ''
      }
    }

    window.addEventListener('beforeunload', listener)

    return () => window.removeEventListener('beforeunload', listener)
  }, deps)
}

export { useConfirmUnload }
