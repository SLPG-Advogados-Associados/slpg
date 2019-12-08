import { useState } from 'react'

const useModal = (initial?: boolean) => {
  const [isOpen, setIsOpen] = useState(initial || false)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  }
}

export { useModal }
