import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import Link from 'next/link'
import { withGraphQL, GT } from '~api'
import { HTMLContent, Heading, Image, styled, t } from '~design'
import { Page } from '~app/components/Page'
import { Section as PageSection } from '~app/components/Section'
import { LocalNav, LocalNavButton } from '~app/components/LocalNav'
import equipe from './equipe.jpg'
import { TEAM } from './team.gql'

const map = [
  ['apresentacao', 'Apresentação'],
  // ['compromissos', 'Compromissos e princípios'],
  ['missao', 'Missão'],
  ['visao', 'Visão'],
  ['valores', 'Valores'],
  ['historia', 'História'],
  ['equipe', 'Equipe'],
] as const

type SectionID = typeof map[number][0]

type SectionProps = {
  id: string
  href: string
  label: string
}

const sections = Object.fromEntries(
  map.map(([id, label]) => [id, { id, label, href: `/quem-somos#${id}` }])
) as Record<SectionID, SectionProps>

const sectionsList = Object.values(sections)

const TeamList = styled.ul`
  display: grid;
  margin: 0 -1.5rem;
  grid-template-columns: 1fr 1fr;
  text-align: center;

  li {
    /* margin: 0 1.5rem 4rem; */
    margin: 0 0.75rem 4rem;
  }

  h4 {
    font-weight: bold;
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

const StyledSetion = styled(PageSection)`
  &:nth-child(even) {
    background-color: #f8f6f3;
  }
`

const Section: React.FC<{ section: SectionProps }> = ({
  section,
  children,
}) => (
  <StyledSetion
    textual
    id={section.id}
    title={
      <a href={section.href} title={section.label}>
        {section.label}
      </a>
    }
  >
    {children}
  </StyledSetion>
)

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
          <Link key={href} href={href}>
            <LocalNavButton href={href} title={label} alt={label}>
              {label}
            </LocalNavButton>
          </Link>
        ))}
      </LocalNav>

      <main>
        <Section section={sections.apresentacao}>
          <HTMLContent>
            <p>
              O SLPG Advogados e Advogadas é um escritório de advocacia (OAB/SC
              270/97) com sede em Florianópolis, especializado na defesa dos
              direitos da classe trabalhadora, em especial os{' '}
              <Link href="/direito-dos-servidores-publicos">
                Direitos dos Servidores Públicos
              </Link>
              .
            </p>

            <p>
              A nossa atuação contempla também os{' '}
              <Link href="/direitos-trabalhistas-do-setor-privado">
                Direitos Trabalhistas
              </Link>
              ,{' '}
              <Link href="/direitos-previdenciarios">
                Direitos Previdenciários
              </Link>
              , <Link href="/direitos-sindicais">Direitos Sindicais</Link> e{' '}
              <Link href="/direitos-civis">Direitos Civis</Link>.
            </p>

            <p>
              Em Santa Catarina nos destacamos pela atuação em favor de diversas
              categorias do funcionalismo, tendo atualmente mais de 12.500
              processos em andamento.{' '}
              <Link href="/atuacao-em-outros-estados-da-federacao">
                Atuamos também em outros estados da federação
              </Link>{' '}
              e dispomos de estrutura para acompanhamento dos processos nos{' '}
              <Link href="/atuacao-nos-tribunais-superiores">
                tribunais superiores
              </Link>
              .
            </p>

            <p>
              A sigla SLPG - Silva, Locks Filho, Palanowski & Goulart foi
              constituída pelas iniciais dos sobrenomes dos quatros primeiros
              sócios fundadores, e se mantém até os dias atuais.
            </p>

            <p>
              Em 2022, ano em que completamos 25 anos de existência,{' '}
              <Link href="/noticias/pelo-reconhecimento-das-mulheres">
                decidimos mudar o nome do escritório
              </Link>{' '}
              de SLPG Advogados Associados para SLPG Advogados e Advogadas,
              entendendo que o novo nome está mais alinhado com os princípios
              defendidos pelo escritório e com o seu histórico de luta pela
              igualdade de gênero.
            </p>

            <Image
              src={equipe}
              altAsCaption
              alt="Palácio Cruz e Sousa. Museu Histórico de Santa Catarina."
            />
          </HTMLContent>
        </Section>

        {/* <Section className="bg-aside" section={sections.compromissos}>
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
        </Section> */}

        <Section section={sections.missao}>
          <HTMLContent>
            <p>
              Continuar sendo um escritório de advocacia comprometido com a
              qualidade e agilidade dos serviços que presta à classe
              trabalhadora, de maneira geral, e aos servidores públicos, em
              particular, buscando satisfazer cada vez mais as expectativas dos
              nossos clientes nas diferentes áreas do Direito.
            </p>
          </HTMLContent>
        </Section>

        <Section section={sections.visao}>
          <HTMLContent>
            <p>
              Ser reconhecido como um escritório de advocacia comprometido com
              os direitos dos trabalhadores e dos servidores públicos, e
              engajado nas lutas por democracia, justiça social, distribuição de
              renda e defesa dos direitos humanos.
            </p>
          </HTMLContent>
        </Section>

        <Section section={sections.valores}>
          <HTMLContent>
            <p>
              Sabedoria, Liderança, Integridade, Criatividade, Proatividade,
              Comprometimento, Solidariedade.
            </p>
          </HTMLContent>
        </Section>

        <Section section={sections.historia}>
          <HTMLContent>
            <p>
              Nosso Escritório foi fundado em 1997 com a finalidade principal de
              prestar assessoria jurídica às entidades representativas de
              servidores públicos e às categorias por elas representadas, sempre
              pautando sua atuação profissional por uma conduta ética,
              responsável e comprometida com a classe trabalhadora.
            </p>

            <p>
              Sua constituição se deu a partir do interesse de algumas entidades
              sindicais que já à época viam a necessidade de contar com um
              escritório de advocacia comprometido com as lutas dos
              trabalhadores, sugerindo então que alguns advogados egressos do
              movimento sindical o constituíssem.
            </p>

            <p>
              Com o passar do tempo o Escritório foi crescendo e a ele foram se
              ligando outras entidades sindicais e associativas representativas
              de servidores públicos. Novos advogados foram incorporados à
              equipe e o Escritório ultrapassou as fronteiras de Santa Catarina.
              Em 2006, através de parcerias estabelecidas com escritórios de
              outros estados, que comungam dos mesmos princípios e ideais,
              contribuímos para a fundação do{' '}
              <Link href="/o-coletivo-nacional-de-advogados-de-servidores-publicos">
                CNASP - Coletivo Nacional de Advogados de Servidores Públicos.
              </Link>
            </p>

            <p>
              Ao longo de mais de duas décadas participamos ativamente de
              diversas lutas contra as reformas da previdência, trabalhista e
              outras que visavam a atacar os direitos sociais, assim como de
              campanhas pela conquista de novos direitos, apoiando juridicamente
              greves e outras ações empreendidas pelo movimento sindical.
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

        <Section section={sections.equipe}>
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
