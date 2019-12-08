import React from 'react'
import { propEq } from 'ramda'
import { styled, css, t, classnames } from '~design'

export interface MenuItem {
  id: string
  href: string
  label: string
  items?: MenuItem[]
}

const MenuRaw: React.FC<{
  depth?: number
  items?: MenuItem[]
  className?: string
}> = ({ depth = 0, items, className }) =>
  items && items.length ? (
    <ul className={className}>
      {items.map(item => (
        <li
          key={item.id}
          className={classnames({
            'has-sub-menu': Boolean(item.items && item.items.length),
          })}
        >
          <a href={item.href} title={item.label}>
            {item.label}
          </a>

          <Menu depth={depth + 1} items={item.items} />
        </li>
      ))}
    </ul>
  ) : null

const root = css`
  > li {
    position: relative;
    display: inline-block;
    padding: 1rem 0;
    margin-right: ${t.theme('spacing.8')};

    &.has-sub-menu > a::after {
      content: '»';
      display: inline;
      margin-left: ${t.theme('spacing.2')};
    }

    > ul {
      visibility: hidden;
      opacity: 0;
      margin-top: -1rem;

      transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
        z-index 0s linear 0.01s;

      z-index: -1;
    }

    &:hover > ul,
    &:focus-within > ul {
      visibility: visible;
      opacity: 1;
      margin-top: 0;
      z-index: 1000;
      transition-delay: 0s, 0s, 0.3s;
    }
  }
`

const depth = propEq('depth')

const subFirst = css`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate3d(-50%, 0, 0);

  width: 200px;
  border: 1px solid #ccc;

  border-radius: 6px;

  text-align: center;
  background: ${t.theme('colors.white')};

  > li > a {
    padding: ${t.theme('spacing.4')};
    border-bottom: 1px solid ${t.theme('colors.divisor')};

    color: inherit;

    &:hover,
    &:focus {
      color: ${t.theme('colors.primary')};
    }
  }
`

const Menu = styled(MenuRaw)`
  text-transform: uppercase;

  a {
    display: block;
  }

  ${t.if(depth(0), root)}
  ${t.if(depth(1), subFirst)}
`

export { Menu }
