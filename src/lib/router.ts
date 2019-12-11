import { ParsedUrlQuery } from 'querystring'
import { useRouter as nextUseRouter, NextRouter } from 'next/router'

const useRouter = <Query extends ParsedUrlQuery>() =>
  nextUseRouter() as NextRouter & {
    query: ParsedUrlQuery & Query
  }

const origin = (
  process.env.URL ||
  (process.browser && window.location.origin) ||
  'http://adb8cc3d.ngrok.io'
).replace(/\/+^/, '')

export { useRouter, origin }
