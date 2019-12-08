import React, { useState } from 'react'
import { Slider as Burger } from 'react-burgers'
import { Menu, MenuItem, styled, t } from '~design'
import { list as expertise } from '~modules/expertise'

const main: Array<MenuItem> = [
  {
    id: 'quem-somos',
    href: '/quem-somos',
    label: 'Quem Somos',
    items: [
      {
        id: 'quem-somos#apresentacao',
        href: '/quem-somos#apresentacao',
        label: 'Apresentação',
      },
      {
        id: 'quem-somos#compromissos-e-principios',
        href: '/quem-somos#compromissos-e-principios',
        label: 'Compromissos e princípios',
      },
      {
        id: 'quem-somos#historia',
        href: '/quem-somos#historia',
        label: 'História',
      },
      { id: 'quem-somos#equipe', href: '/quem-somos#equipe', label: 'Equipe' },
    ],
  },
  {
    id: 'o-que-fazemos',
    href: '#',
    label: 'O que fazemos',
    items: expertise,
  },
  { id: 'blogue', href: '/blogue', label: 'Blogue' },
  { id: 'contato', href: '/contato', label: 'Contato' },
]

const StyledBurger = styled(Burger)`
  display: block !important;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: none !important;
  }
`

const StyledMenu = styled(Menu)`
  display: none;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: block;
  }
`

const SidebarMenu: React.FC<{ items: MenuItem[] }> = ({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <a href={item.href} title={item.label}>
          {item.label}
        </a>

        {item.items && item.items.length ? (
          <SidebarMenu items={item.items} />
        ) : null}
      </li>
    ))}
  </ul>
)

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 80%;
  height: 100%;
  background-color: white;
  box-shadow: 1.5rem 0 3rem -1.5rem rgba(0, 0, 0, 0.5);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: 250ms transform;
  will-change: transform;

  ${t.ifProp('isOpen', 'transform: translateX(0);')}

  > ul {
    max-height: 100%;
    overflow: auto;
  }

  li {
    a {
      display: block;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    ul a {
      padding-left: 2rem;
    }
  }
`

const SidebarWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.25);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: 250ms opacity;
  will-change: opacity, visibility, pointer-events;

  ${t.ifProp(
    'isOpen',
    'opacity: 1; visibility: visible; pointer-events: initial;'
  )}
`

const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <StyledBurger active={isOpen} onClick={() => setIsOpen(!isOpen)} />

      <StyledMenu depth={0} items={main} />

      <SidebarWrapper isOpen={isOpen} onClick={() => setIsOpen(false)}>
        <Sidebar onClick={e => e.stopPropagation()} isOpen={isOpen}>
          <SidebarMenu items={main} />
        </Sidebar>
      </SidebarWrapper>
    </>
  )
}

export { MainMenu }
