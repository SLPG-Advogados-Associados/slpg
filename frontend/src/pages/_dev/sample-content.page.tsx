import React from 'react'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { Body } from '~design'
import { body } from '~content/sample.md'

const SampleContentPage = () => (
  <Page>
    <Section>Hello!</Section>
    <Body content={body} />
  </Page>
)

export default SampleContentPage
