import React from 'react'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { useQuery } from '@apollo/react-hooks'
import { STATUS } from './index.gql'

const Home = () => {
  const { data } = useQuery<GT.STATUS_QUERY>(STATUS)

  return (
    <Page>
      Home (status: {(data && JSON.stringify(data.status)) || 'none'})
    </Page>
  )
}

export default withGraphQL(Home)
