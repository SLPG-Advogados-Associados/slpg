const R = require('ramda')
const defaultTheme = require('tailwindcss/defaultTheme')
const tinycolor = require('tinycolor2')

const darken = (amount = 100) => color => tinycolor(color).darken(amount).toString()

const t = (path, transform = R.identity) => R.pipe(
  R.path(path.split('.')),
  transform
)

const initial = {
  colors: {
    black: '#010101',
    white: '#ffffff',
    pampas: '#F8F6F3',

    gray: {
      default: '#7F7F7F',
      300: '#E8E6E3',
      500: '#bcbcbd',
      700: '#6b6c6d',
      800: '#606060',
    },

    blue: {
      500: '#17365C',
      700: '#072242',
    },

    red: {
      700: '#8f2c1d'
    }
  },

  fontSize: {
    100: '0.75rem', //  12px
    200: '0.875rem', // 14px
    400: '1rem', //     16px <-- base
    500: '1.125rem', // 18px
    600: '1.25rem',
    700: '1.5rem', //   24px
    800: '1.75rem', //  28px
    1000: '2rem', //    32px
    1200: '3rem',
    1400: '4rem',
  },

  fontFamily: {
    mono: ['Roboto Mono', 'monospace']
  },

  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
  },
}

const semantic = {
  colors: {
    silent: t('colors.gray.500'),
    primary: t('colors.blue.700'),
    'primary--active': t('colors.blue.500'),
    danger: t('colors.red.700'),
  },
}

const functional = {
  colors: {
    body: t('colors.gray.800'),
    text: t('colors.gray.800'),
    link: t('colors.primary'),
    'link--active': t('colors.black'),
    button: t('colors.white'),
    divisor: t('colors.gray.300'),
    border: t('colors.gray.300'),
    'reverse-border': t('colors.primary--active'),
    aside: t('colors.pampas'),
  },

  backgroundColor: {
    reverse: t('colors.primary'),
    button: t('colors.primary'),
    'button--active': t('colors.primary--active'),
    'button-secondary': t('colors.pampas'),
    'button-secondary--active': t('colors.pampas', darken(5)),
    aside: t('colors.pampas'),
  },

  fontSize: {
    footnote: t('fontSize.100'),
    // 200
    meta: t('fontSize.200'),
    button: '1em',
    // 400
    base: t('fontSize.400'),
    menu: t('fontSize.400'),
    text: t('fontSize.500'),
    // 500
    'aside-title': t('fontSize.500'),
    'secondary-title': t('fontSize.500'),
    // 700
    cta: t('fontSize.700'),
    'item-title': t('fontSize.700'),
    'textual-title': t('fontSize.700'),
    // 800
    title: t('fontSize.800'),
    // 1000
    heading: t('fontSize.1000'),
  },
}

const extend = [initial, semantic, functional].reduce((theme, curr) => {
  for (const key in curr) {
    let val = curr[key]

    // resolver
    if (typeof val === 'function') val = val(theme)

    // found scalar
    if (typeof val !== 'object') {
      theme[key] = val
      continue
    }

    const prev = theme[key]

    // ensure structure
    theme[key] = prev || {}

    for (const sub in val) {
      let subVal = val[sub]

      // resolver
      if (typeof subVal === 'function') subVal = subVal(theme)

      // found scalar
      if (typeof subVal !== 'object') {
        theme[key][sub] = subVal
        continue
      }

      theme[key] = val
    }

    // handle default first-level processed theme.
    if (typeof prev === 'function') {
      const extend = theme[key]
      theme[key] = (...args) => ({ ...prev(...args), ...extend })
    }
  }

  return theme
}, defaultTheme)

module.exports = {
  theme: { extend },
  variants: {},
  plugins: [],
}
