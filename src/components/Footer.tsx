import React from 'react'
import {
  t,
  styled,
  Container,
  Button,
  AsideTitle,
  Logo,
  Icons,
  // Modal,
  // ModalClose,
  // useModal,
  classed,
} from '~design'
import { list as expertises } from '~modules/expertise'
// import { NewsletterForm } from '~modules/newsletter'
import { Address } from '~app/components/Address'
import { Phone } from '~app/components/Phone'

const FooterColumn = styled.div.attrs(classed('px-md'))`
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 2rem;
`

const FooterSocial = styled.ul`
  margin: ${t.theme('spacing.4')} 0;

  li {
    display: inline-block;
    margin: ${t.theme('spacing.2')};
  }
`

const FooterMenu = styled.ul`
  li {
    margin-top: ${t.theme('spacing.2')};
  }
`

const FooterLogoAnchor = styled.a`
  max-width: 320px;
`

const Footer = () => {
  // const newsletter = useModal()

  return (
    <footer>
      <Container className="flex pt-12 text-200 flex-col lg:flex-row lg:items-baseline">
        <FooterColumn className="text-center">
          <FooterLogoAnchor href="/" title="Início" className="inline-block">
            <Logo />
          </FooterLogoAnchor>
          <p>OAB/SC 270/97</p>
          {/* <Button small onClick={newsletter.open}>
            Receba nossos informativos
          </Button> */}

          {/* <Modal isOpen={newsletter.isOpen} onRequestClose={newsletter.close}>
            <div className="bg-white text-left border py-6 relative">
              <ModalClose onRequestClose={newsletter.close} />
              <NewsletterForm onSuccess={newsletter.close} />
            </div>
          </Modal> */}

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
            <li>
              <Button
                circle
                small
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/slpgadvogados/"
              >
                <Icons.Instagram />
              </Button>
            </li>
          </FooterSocial>
        </FooterColumn>

        <FooterColumn className="text-center lg:text-left lg:flex lg:justify-center">
          <div>
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
          </div>
        </FooterColumn>

        <FooterColumn className="text-center lg:text-left lg:flex lg:justify-center">
          <div>
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
          </div>
        </FooterColumn>
      </Container>

      <div className="bg-reverse text-white py-3 text-center">
        <Container>
          <Address>
            <span>
              Telefone: <Phone />
            </span>
          </Address>
        </Container>
      </div>
    </footer>
  )
}

export { Footer }
