/**
 * Next.js/Netlify adaptor
 */
import express, { RequestHandler } from 'express'
import parser from 'body-parser'
import adapter from 'lambda-router-adapter'

const adaptor = <R extends RequestHandler>(handler: R) => {
  // Next.js is express compatible already.
  const next = handler

  // Netlify is an AWS lambda, so we need to adapt it to express APIs.
  const netlify = adapter.newExpressHandler(
    express()
      .use(parser.json())
      .use(handler)
  )

  return { next, netlify }
}

export { adaptor }
