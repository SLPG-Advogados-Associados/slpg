import React from 'react'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const QUERY = gql`
  query STATUS {
    status
  }
`

const Home = () => {
  const { data } = useQuery<GT.Query>(QUERY)

  return (
    <Page>
      Home (status: {(data && JSON.stringify(data.status)) || 'none'})
    </Page>
  )
}

export default withGraphQL(Home)
