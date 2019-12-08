import React from 'react'
import styled from 'styled-components'
import { theme } from 'styled-tools'
import { Container, Button, AsideTitle, Logo, Icons, classed } from '~design'
import { list as expertises } from '~modules/expertise'

const FooterColumn = styled(classed.div`px-md`)`
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 2rem;
`

const FooterSocial = styled.ul`
  margin: ${theme('spacing.4')} 0;

  li {
    display: inline-block;
    margin: ${theme('spacing.2')};
  }
`

const FooterMenu = styled.ul`
  li {
    margin-top: ${theme('spacing.2')};
  }
`

const FooterLogoAnchor = styled.a`
  max-width: 320px;
`

const Footer = () => (
  <footer>
    <Container className="flex pt-12 text-200 flex-col lg:flex-row">
      <FooterColumn className="text-center">
        <FooterLogoAnchor href="/" title="Início" className="inline-block">
          <Logo />
        </FooterLogoAnchor>
        <p>OAB/SC 270/97</p>
        <Button small>Receba nossos informativos</Button>

        <FooterSocial>
          <li>
            <Button
              circle
              small
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/SLPG.Advogados.Associados/"
            >
              <Icons.Facebook />
            </Button>
          </li>
          <li>
            <Button
              circle
              small
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/channel/UCjbphG4OMGO9n7DhJ4ckS3g"
            >
              <Icons.YouTube />
            </Button>
          </li>
        </FooterSocial>
      </FooterColumn>

      <FooterColumn className="text-center lg:text-left">
        <AsideTitle>Áreas de atuação</AsideTitle>

        <FooterMenu>
          {expertises.map(({ id, label, href }) => (
            <li key={id}>
              <a href={href} title={label}>
                {label}
              </a>
            </li>
          ))}
        </FooterMenu>
      </FooterColumn>

      <FooterColumn className="text-center lg:text-left">
        <AsideTitle>Menu</AsideTitle>

        <FooterMenu>
          <li>
            <a href="/blogue" title="Blogue">
              Blogue
            </a>
          </li>
          <li>
            <a href="/contato" title="Contato">
              Contato
            </a>
          </li>
          <li>
            <a href="/quem-somos" title="Quem somos">
              Quem somos
            </a>
          </li>
        </FooterMenu>
      </FooterColumn>
    </Container>

    <div className="bg-reverse text-white py-3 text-center">
      <Container>
        Florianópolis/SC. Rua: Nunes Machado, ed. Tiradentes, nº 94, 9º andar.
        CEP 88010-460. Telefone: (48) 3024-4166
      </Container>
    </div>
  </footer>
)

export { Footer }
