import { ParsedUrlQuery } from 'querystring'
import { useRouter as nextUseRouter, NextRouter } from 'next/router'

const useRouter = <Query extends ParsedUrlQuery>() =>
  nextUseRouter() as NextRouter & {
    query: ParsedUrlQuery & Query
  }

export { useRouter }
