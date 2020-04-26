import React, { createContext, useContext, useMemo } from 'react'
import { NextApiRequest } from 'next'
import MobileDetect from 'mobile-detect'

const MobileDetectContext = createContext<MobileDetect>(null)

const getUserAgent = ({ req }: { req: NextApiRequest }) =>
  req ? req.headers['user-agent'] : window.navigator.userAgent

const Provider: React.FC<{ userAgent: string }> = ({ children, userAgent }) => {
  const mobileDetect = useMemo(() => new MobileDetect(userAgent), [userAgent])

  return (
    <MobileDetectContext.Provider value={mobileDetect}>
      {children}
    </MobileDetectContext.Provider>
  )
}

const useUserAgent = () => useContext(MobileDetectContext)

const isMobile = () => new MobileDetect(window.navigator.userAgent).mobile()

export { Provider, getUserAgent, useUserAgent, isMobile }
