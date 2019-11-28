import React from 'react'
import { Page } from '~app/components/Page'
import { Button, Container, Title, Heading, classed, t } from '~design'

const Section = classed.section`py-12 border-b border-divisor`

const sections = [
  {
    href: '/quem-somos#apresentacao',
    label: 'Apresentação',
  },
  {
    href: '/quem-somos#compromissos-e-principios',
    label: 'Compromissos e princípios',
  },
  {
    href: '/quem-somos#historia',
    label: 'História',
  },
  { href: '/quem-somos#equipe', label: 'Equipe' },
]

const PostPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>Quem Somos</Heading>
    </div>

    <nav className="bg-button sticky top-0">
      <Container className="text-center border-t-2 border-reverse-border">
        {sections.map(({ href, label }) => (
          <Button as="a" key={href} href={href} title={label} alt={label}>
            {label}
          </Button>
        ))}
      </Container>
    </nav>

    <Container as="main">
      <Section id="apresentacao">
        <header>
          <Title>Apresentação</Title>
        </header>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          feugiat odio nec dui pulvinar pretium. Donec pellentesque accumsan
          dolor, sit amet luctus erat condimentum quis. Donec id magna ornare,
          varius enim sed, hendrerit felis. Nam pulvinar molestie pretium.
          Pellentesque mollis suscipit commodo. Mauris eu sollicitudin lacus.
          Proin fringilla nibh nisi, quis sollicitudin tortor dignissim eu. Ut
          sed pretium tortor. Aenean consequat lacus sed leo rhoncus, vel
          volutpat tortor ultricies. Nulla eu aliquet diam. Donec id viverra
          massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Nullam id turpis eu tellus facilisis porttitor. Nunc ut accumsan
          sapien. Nulla placerat leo nisl. Etiam at aliquet enim, sit amet
          tempus nisi.
        </p>

        <p>
          Cras sit amet nibh eu nibh posuere lacinia. Mauris elit nulla,
          interdum sit amet ante eu, gravida blandit lorem. Mauris pellentesque
          odio interdum, fringilla leo quis, vestibulum mauris. Cras blandit
          justo sed venenatis pharetra. In euismod justo a scelerisque luctus.
          Mauris suscipit felis vel lorem porttitor consectetur. Curabitur
          efficitur condimentum purus vel dapibus. Etiam nibh elit, aliquam ac
          libero a, porta varius massa. Nunc ultricies turpis in nisi suscipit,
          id auctor ante congue. Aliquam massa nunc, eleifend sit amet eros non,
          feugiat vestibulum enim. Aliquam vehicula tempus odio, pulvinar
          eleifend ex placerat non.
        </p>
      </Section>

      <Section id="compromissos-e-principios">
        <header>
          <Title>Compromissos e princípios</Title>
        </header>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          feugiat odio nec dui pulvinar pretium. Donec pellentesque accumsan
          dolor, sit amet luctus erat condimentum quis. Donec id magna ornare,
          varius enim sed, hendrerit felis. Nam pulvinar molestie pretium.
          Pellentesque mollis suscipit commodo. Mauris eu sollicitudin lacus.
          Proin fringilla nibh nisi, quis sollicitudin tortor dignissim eu. Ut
          sed pretium tortor. Aenean consequat lacus sed leo rhoncus, vel
          volutpat tortor ultricies. Nulla eu aliquet diam. Donec id viverra
          massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Nullam id turpis eu tellus facilisis porttitor. Nunc ut accumsan
          sapien. Nulla placerat leo nisl. Etiam at aliquet enim, sit amet
          tempus nisi.
        </p>

        <p>
          Cras sit amet nibh eu nibh posuere lacinia. Mauris elit nulla,
          interdum sit amet ante eu, gravida blandit lorem. Mauris pellentesque
          odio interdum, fringilla leo quis, vestibulum mauris. Cras blandit
          justo sed venenatis pharetra. In euismod justo a scelerisque luctus.
          Mauris suscipit felis vel lorem porttitor consectetur. Curabitur
          efficitur condimentum purus vel dapibus. Etiam nibh elit, aliquam ac
          libero a, porta varius massa. Nunc ultricies turpis in nisi suscipit,
          id auctor ante congue. Aliquam massa nunc, eleifend sit amet eros non,
          feugiat vestibulum enim. Aliquam vehicula tempus odio, pulvinar
          eleifend ex placerat non.
        </p>
      </Section>

      <Section id="historia">
        <header>
          <Title>História</Title>
        </header>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          feugiat odio nec dui pulvinar pretium. Donec pellentesque accumsan
          dolor, sit amet luctus erat condimentum quis. Donec id magna ornare,
          varius enim sed, hendrerit felis. Nam pulvinar molestie pretium.
          Pellentesque mollis suscipit commodo. Mauris eu sollicitudin lacus.
          Proin fringilla nibh nisi, quis sollicitudin tortor dignissim eu. Ut
          sed pretium tortor. Aenean consequat lacus sed leo rhoncus, vel
          volutpat tortor ultricies. Nulla eu aliquet diam. Donec id viverra
          massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Nullam id turpis eu tellus facilisis porttitor. Nunc ut accumsan
          sapien. Nulla placerat leo nisl. Etiam at aliquet enim, sit amet
          tempus nisi.
        </p>

        <p>
          Cras sit amet nibh eu nibh posuere lacinia. Mauris elit nulla,
          interdum sit amet ante eu, gravida blandit lorem. Mauris pellentesque
          odio interdum, fringilla leo quis, vestibulum mauris. Cras blandit
          justo sed venenatis pharetra. In euismod justo a scelerisque luctus.
          Mauris suscipit felis vel lorem porttitor consectetur. Curabitur
          efficitur condimentum purus vel dapibus. Etiam nibh elit, aliquam ac
          libero a, porta varius massa. Nunc ultricies turpis in nisi suscipit,
          id auctor ante congue. Aliquam massa nunc, eleifend sit amet eros non,
          feugiat vestibulum enim. Aliquam vehicula tempus odio, pulvinar
          eleifend ex placerat non.
        </p>
      </Section>

      <Section id="equipe">
        <header>
          <Title>Equipe</Title>
        </header>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          feugiat odio nec dui pulvinar pretium. Donec pellentesque accumsan
          dolor, sit amet luctus erat condimentum quis. Donec id magna ornare,
          varius enim sed, hendrerit felis. Nam pulvinar molestie pretium.
          Pellentesque mollis suscipit commodo. Mauris eu sollicitudin lacus.
          Proin fringilla nibh nisi, quis sollicitudin tortor dignissim eu. Ut
          sed pretium tortor. Aenean consequat lacus sed leo rhoncus, vel
          volutpat tortor ultricies. Nulla eu aliquet diam. Donec id viverra
          massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Nullam id turpis eu tellus facilisis porttitor. Nunc ut accumsan
          sapien. Nulla placerat leo nisl. Etiam at aliquet enim, sit amet
          tempus nisi.
        </p>

        <p>
          Cras sit amet nibh eu nibh posuere lacinia. Mauris elit nulla,
          interdum sit amet ante eu, gravida blandit lorem. Mauris pellentesque
          odio interdum, fringilla leo quis, vestibulum mauris. Cras blandit
          justo sed venenatis pharetra. In euismod justo a scelerisque luctus.
          Mauris suscipit felis vel lorem porttitor consectetur. Curabitur
          efficitur condimentum purus vel dapibus. Etiam nibh elit, aliquam ac
          libero a, porta varius massa. Nunc ultricies turpis in nisi suscipit,
          id auctor ante congue. Aliquam massa nunc, eleifend sit amet eros non,
          feugiat vestibulum enim. Aliquam vehicula tempus odio, pulvinar
          eleifend ex placerat non.
        </p>
      </Section>
    </Container>
  </Page>
)

export default PostPage
