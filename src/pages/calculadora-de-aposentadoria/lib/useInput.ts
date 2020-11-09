import { useMemo } from 'react'
import qs from 'qs'
import { Calculator } from '~modules/retirenment'
import { useRouter } from '~app/lib/router'

type ParsedInput = {
  sex: string
  birthDate: string
  contributions: {
    start: string
    end?: string
    service: {
      title?: string
      kind: string
      post: string
      career: string
    }
  }[]
}

const parseInput = (raw: string): Calculator.CalculatorInput => {
  if (!raw) return null

  const parsed = (qs.parse(
    decodeURIComponent(raw),
    {}
  ) as unknown) as ParsedInput

  return {
    sex: parsed.sex as Calculator.Sex,
    birthDate: new Date(parsed.birthDate as string),
    contributions: parsed.contributions.map((contribution) => ({
      start: new Date(contribution.start),
      end: contribution.end ? new Date(contribution.end) : undefined,
      salary: 0,
      service: {
        title: contribution.service.title,
        kind: contribution.service.kind as Calculator.ServiceKind,
        post: contribution.service.post as Calculator.Post,
        // post: Calculator.Post['OTHER'],
        career: Number(contribution.service.career),
      },
    })),
  }
}

/**
 * Load input from URL and parse it.
 */
const useInput = () => {
  const router = useRouter<{ input: string }>()
  return useMemo(() => parseInput(router.query.input), [router.query.input])
}

export { useInput }
