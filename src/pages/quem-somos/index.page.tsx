import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { HTMLContent, Heading, Image, styled, t } from '~design'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { ContactCTA } from '~app/components/ContactCTA'
import { LocalNav, LocalNavButton } from '~app/components/LocalNav'
import equipe from './equipe.jpg'
import { TEAM } from './team.gql'

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

const TeamList = styled.ul`
  display: grid;
  margin: 0 -1.5rem;
  grid-template-columns: 1fr 1fr;
  text-align: center;

  li {
    margin: 0 1.5rem 4rem;
  }

  h4 {
    margin-top: 0.5rem;
    font-size: ${t.theme('fontSize.aside-title')};
    color: ${t.theme('colors.primary')};
  }

  span {
    display: block;
    margin-top: 0.5rem;
    font-size: ${t.theme('fontSize.meta')};
  }

  @media screen and (min-width: ${t.theme('screens.sm')}) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (min-width: ${t.theme('screens.md')}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  @media screen and (min-width: ${t.theme('screens.xl')}) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
`

const QuemSomosPage = () => {
  const team = useQuery<GT.TEAM_QUERY>(TEAM)

  return (
    <Page
      meta={{
        title: 'Quem Somos',
        image: equipe,
        description:
          'O SLPG é um escritório de advocacia de Florianópolis, fundado em 1997.',
      }}
    >
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Quem Somos</Heading>
      </div>

      <LocalNav className="top-0 lg:sticky">
        {sectionsList.map(({ href, label }) => (
          <LocalNavButton key={href} href={href} title={label} alt={label}>
            {label}
          </LocalNavButton>
        ))}
      </LocalNav>

      <main>
        <Section
          id="apresentacao"
          title={<SectionTitle {...sections.apresentacao} />}
          textual
        >
          <HTMLContent>
            <p>
              O SLPG é um escritório de advocacia (OAB/SC 270/97) com sede em
              Florianópolis, especializado na defesa dos direitos da classe
              trabalhadora, em especial dos servidores públicos.
            </p>

            <p>
              Em Santa Catarina somos um dos maiores escritórios de advocacia do
              ramo, com mais de 10 mil processos em andamento, sobretudo na
              Justiça Federal.
            </p>

            <p>
              A sigla SLPG - Silva, Locks Filho, Palanowski & Goulart Advogados
              Associados foi constituida pelas iniciais dos sobrenomes dos
              quatros primeiros sócios fundadores, e se mantém até os dias
              atuais.
            </p>

            <Image
              src={equipe}
              altAsCaption
              alt="Palácio Cruz e Sousa. Museu Histórico de Santa Catarina."
            />
          </HTMLContent>
        </Section>

        <Section
          id="compromissos-e-principios"
          className="bg-aside"
          title={<SectionTitle {...sections.compromissos} />}
          textual
        >
          <HTMLContent>
            <p>
              Nosso Escritório foi constituído com a finalidade principal de
              prestar assessoria jurídica às entidades representativas de
              servidores públicos e às categorias por elas representadas, sempre
              pautando sua atuação profissional por uma conduta ética,
              responsável e comprometida com a classe trabalhadora.
            </p>

            <p>
              Nesta condição, e conscientes do papel social que desempenhamos,
              não nos omitimos em manifestar nossas posições com relação aos
              grandes temas de interesse da sociedade brasileira, procurando
              fazê-lo sempre com o propósito de auxiliar as entidades sindicais
              e organizações da classe trabalhadora na luta por melhorias de
              suas condições salariais e de trabalho, bem como pela manutenção,
              eficácia e ampliação dos direitos sociais previstos na
              Constituição Federal de 1988.
            </p>
          </HTMLContent>
        </Section>

        <Section
          id="historia"
          title={<SectionTitle {...sections.historia} />}
          textual
        >
          <HTMLContent>
            <p>
              Nosso Escritório foi fundado em 1997, a partir do interesse de
              algumas entidades sindicais que já à época viam a necessidade de
              contar com um escritório de advocacia comprometido com as lutas
              dos trabalhadores, sugerindo então que alguns advogados egressos
              do movimento sindical o constituíssem.
            </p>

            <p>
              Com o passar do tempo, o Escritório foi crescendo e a ele foram se
              ligando outras entidades sindicais e associativas representativas
              de servidores públicos e se incorporando outros advogados e
              advogadas, o que permitiu que o Escritório ultrapassasse as
              fronteiras de Santa Catarina. E, através de parcerias
              estabelecidas com escritórios de outros estados, que comungam dos
              mesmos princípios e ideais, contribuímos para a fundação do CNASP
              - Coletivo Nacional de Advogados de Servidores Públicos.
            </p>

            <p>
              Nestes mais de 20 anos de história, participamos ativamente de
              diversas lutas contra as reformas da previdência, trabalhista e
              outras que visavam a atacar os direitos sociais, assim como de
              campanhas pela conquista de novos direitos, apoiando juridicamente
              greves e outras ações empreendidas pelo movimento sindical.
            </p>

            <p>
              Para enfrentar estes desafios, passados e futuros, temos investido
              fortemente na qualificação técnica e política dos componentes do
              Escritório, bem como na ampliação das nossas relações com outras
              organizações e movimentos sociais de maneira geral, visando sempre
              ao apoio mais qualificado possível às necessidades da classe
              trabalhadora.
            </p>
          </HTMLContent>
        </Section>

        <Section
          id="equipe"
          className="bg-aside"
          title={<SectionTitle {...sections.equipe} />}
          textual
        >
          <HTMLContent>
            <p>Conheça os trabalhadores e trabalhadoras do SLPG</p>
          </HTMLContent>

          {team.data ? (
            <TeamList>
              {team.data.team.map(({ id, name, photo, role, oab }) => (
                <li key={id}>
                  <img src={photo} alt={name} title={name} />
                  <h4>{name}</h4>
                  <span>{role}</span>
                  {oab ? <span>{oab}</span> : null}
                </li>
              ))}
            </TeamList>
          ) : null}
        </Section>
      </main>
    </Page>
  )
}

export default withGraphQL(QuemSomosPage)
