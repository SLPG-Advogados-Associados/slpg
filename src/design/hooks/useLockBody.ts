import { useEffect } from 'react'

const useLockBody = (status = true) =>
  useEffect(() => {
    if (status) {
      // Get original body overflow
      const originalStyle = window.getComputedStyle(document.body).overflow
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden'
      // Re-enable scrolling when component unmounts
      return () => (document.body.style.overflow = originalStyle)
    }
  }, [status])

export { useLockBody }
