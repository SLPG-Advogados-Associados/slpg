import React from 'react'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { react as Content } from '~content/sample.md'

const SampleContentPage = () => (
  <Page>
    <Section>Hello!</Section>
    <Content />
  </Page>
)

export default SampleContentPage
