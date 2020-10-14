/**
 * Next.js/Netlify adaptor
 */
import express, { RequestHandler } from 'express'
// import { createServer, proxy } from 'aws-serverless-express'
import adapter from 'lambda-router-adapter'

const adaptor = <Handler extends RequestHandler>(handler: Handler) => {
  // Next.js is express compatible already.
  const next = handler

  // Netlify is an AWS lambda, so we need to adapt it to express APIs.
  const netlify = adapter.newExpressHandler(express().use(handler))

  return { next, netlify }
}

export { adaptor }
