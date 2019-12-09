import React, { useEffect, useState, StyleHTMLAttributes } from 'react'
import { animated, config, useSpring } from 'react-spring'
import classnames from 'classnames'
import keycode from 'keycode'
import { Icons } from './Icons'
import { styled } from '../lib/styled'

type Props = StyleHTMLAttributes<HTMLDivElement> & {
  isOpen?: boolean
  isBlocking?: boolean // Prevents modal from closing when clicking outside
  /**
   * Unmount the contents of this modal when animation is finished
   */
  persist?: boolean
  onRequestClose?: () => void
}

const Content = styled(animated.div)`
  pointer-events: none;

  & > * {
    pointer-events: auto;
    max-height: 100vh;
    overflow-y: auto;
  }
`

const Modal: React.FC<Props> = ({
  isOpen,
  persist = false,
  isBlocking = false,
  onRequestClose = () => {},
  children,
  className,
  style,
}) => {
  const [isCompletelyClosed, setCompletelyClosed] = useState(!isOpen)

  const { backgroundColor, transform, opacity } = useSpring({
    backgroundColor: isOpen
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(255, 255, 255, 0)',
    transform: isOpen
      ? 'translate(0, 0) scale(1)'
      : 'translate(0, 40px) scale(0.97)',
    opacity: isOpen ? 1 : 0,
    config: config.stiff,
    onStart: () => (isOpen ? setCompletelyClosed(false) : null),
    onRest: () => (isOpen ? null : setCompletelyClosed(true)),
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function listener(e: KeyboardEvent) {
      if (e.keyCode === keycode('esc') && !isBlocking) {
        onRequestClose()
      }
    }

    window.addEventListener('keydown', listener, {
      capture: true,
      passive: true,
    })

    return () => window.removeEventListener('keydown', listener)
  }, [isBlocking, isOpen, onRequestClose])

  if (!persist && isCompletelyClosed) {
    return null
  }

  return (
    <animated.div
      className={classnames(
        className,
        'fixed',
        'w-full',
        'h-full',
        'z-50',
        'top-0',
        'left-0',
        'right-0',
        'bottom-0',
        { 'pointer-events-none': !isOpen }
      )}
      style={{ ...style, backgroundColor }}
    >
      <button
        className={classnames('absolute left-0 w-full h-full', {
          'pointer-events-none': isBlocking,
        })}
        onClick={onRequestClose}
      />
      <Content
        className="w-full h-full flex justify-center items-center"
        style={{ transform, opacity }}
      >
        {isOpen ? children : null}
      </Content>
    </animated.div>
  )
}

const ModalClose: React.FC<{ onRequestClose?: () => void }> = ({
  onRequestClose,
}) => (
  <button className="absolute top-0 right-0 p-4" onClick={onRequestClose}>
    <Icons.X />
  </button>
)

export { Modal, ModalClose }
