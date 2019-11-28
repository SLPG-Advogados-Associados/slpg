import React from 'react'
import { Page } from '~app/components/Page'
import { Button, Container, Heading, Icons } from '~design'
import { Section } from '~app/components/Section'

const sections = {
  apresentacao: {
    href: '/quem-somos#apresentacao',
    label: 'Apresentação',
  },
  compromissos: {
    href: '/quem-somos#compromissos-e-principios',
    label: 'Compromissos e princípios',
  },
  historia: {
    href: '/quem-somos#historia',
    label: 'História',
  },
  equipe: { href: '/quem-somos#equipe', label: 'Equipe' },
}

const sectionsList = Object.values(sections)

const SectionTitle: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => (
  <a href={href} title={label}>
    {label}
  </a>
)

const PostPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>Quem Somos</Heading>
    </div>

    <nav className="bg-button sticky top-0">
      <Container className="text-center border-t-2 border-reverse-border">
        {sectionsList.map(({ href, label }) => (
          <Button as="a" key={href} href={href} title={label} alt={label}>
            {label}
          </Button>
        ))}
      </Container>
    </nav>

    <main>
      <Section
        id="apresentacao"
        title={<SectionTitle {...sections.apresentacao} />}
        textual
      >
        <p>
          O SLPG é um escritório de advocacia (OAB/SC 270/97) com sede em
          Florianópolis, especializado na defesa dos direitos da classe
          trabalhadora, em especial dos servidores públicos.
        </p>

        <p>
          Em Santa Catarina somos um dos maiores escritórios de advocacia do
          ramo, com mais de 10 mil processos em andamento, sobretudo na Justiça
          Federal.
        </p>

        <p>
          A sigla SLPG - Silva, Locks Filho, Palanowski & Goulart Advogados
          Associados foi constituida pelas iniciais dos sobrenomes dos quatros
          primeiros sócios fundadores, e se mantém até os dias atuais.
        </p>

        <figure>
          <img src="https://picsum.photos/1000/400" alt="" />

          <figcaption>
            Palácio Cruz e Sousa. Museu Histórico de Santa Catarina.
          </figcaption>
        </figure>
      </Section>

      <Section
        id="compromissos-e-principios"
        className="bg-aside"
        title={<SectionTitle {...sections.compromissos} />}
        textual
      >
        <p>
          Nosso Escritório foi constituído com a finalidade principal de prestar
          assessoria jurídica às entidades representativas de servidores
          públicos e às categorias por elas representadas, sempre pautando sua
          atuação profissional por uma conduta ética, responsável e comprometida
          com a classe trabalhadora.
        </p>

        <p>
          Nesta condição, e conscientes do papel social que desempenhamos, não
          nos omitimos em manifestar nossas posições com relação aos grandes
          temas de interesse da sociedade brasileira, procurando fazê-lo sempre
          com o propósito de auxiliar as entidades sindicais e organizações da
          classe trabalhadora na luta por melhorias de suas condições salariais
          e de trabalho, bem como pela manutenção, eficácia e ampliação dos
          direitos sociais previstos na Constituição Federal de 1988.
        </p>
      </Section>

      <Section
        id="historia"
        title={<SectionTitle {...sections.historia} />}
        textual
      >
        <p>
          Nosso Escritório foi fundado em 1997, a partir do interesse de algumas
          entidades sindicais que já à época viam a necessidade de contar com um
          escritório de advocacia comprometido com as lutas dos trabalhadores,
          sugerindo então que alguns advogados egressos do movimento sindical o
          constituíssem.
        </p>

        <p>
          Com o passar do tempo, o Escritório foi crescendo e a ele foram se
          ligando outras entidades sindicais e associativas representativas de
          servidores públicos e se incorporando outros advogados e advogadas, o
          que permitiu que o Escritório ultrapassasse as fronteiras de Santa
          Catarina. E, através de parcerias estabelecidas com escritórios de
          outros estados, que comungam dos mesmos princípios e ideais,
          contribuímos para a fundação do CNASP - Coletivo Nacional de Advogados
          de Servidores Públicos.
        </p>

        <p>
          Nestes mais de 20 anos de história, participamos ativamente de
          diversas lutas contra as reformas da previdência, trabalhista e outras
          que visavam a atacar os direitos sociais, assim como de campanhas pela
          conquista de novos direitos, apoiando juridicamente greves e outras
          ações empreendidas pelo movimento sindical.
        </p>

        <p>
          Para enfrentar estes desafios, passados e futuros, temos investido
          fortemente na qualificação técnica e política dos componentes do
          Escritório, bem como na ampliação das nossas relações com outras
          organizações e movimentos sociais de maneira geral, visando sempre ao
          apoio mais qualificado possível às necessidades da classe
          trabalhadora.
        </p>
      </Section>

      <Section
        id="equipe"
        className="bg-aside"
        title={<SectionTitle {...sections.equipe} />}
        textual
      >
        <p>Conheça os trabalhadores e trabalhadoras do SLPG</p>

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
    </main>

    <div className="bg-reverse text-white text-center pt-10 pb-12">
      <p className="text-800">Alguma dúvida sobre seus direitos?</p>
      <Button as="a" href="/contato" big cta>
        Entre em contato <Icons.ArrowRight className="ml-2" />
      </Button>
    </div>
  </Page>
)

export default PostPage
