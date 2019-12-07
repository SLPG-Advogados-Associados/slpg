/* eslint-disable @typescript-eslint/no-var-requires, no-console, no-process-env */

const nextInit = require('next')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = nextInit({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(
    proxyMiddleware('/.netlify', {
      target: 'http://localhost:9000',
      pathRewrite: { '^/.netlify/functions': '' },
    })
  )

  server.get('*', handle)

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
