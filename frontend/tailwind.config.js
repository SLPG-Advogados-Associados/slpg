const R = require('ramda')
const defaultTheme = require('tailwindcss/defaultTheme')

const t = path => theme => R.path(path.split('.'), theme)

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
    },

    blue: {
      500: '#17365C',
      700: '#072242',
    },
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
    primary: t('colors.blue.700'),
    'primary--active': t('colors.blue.500'),
  },
}

const functional = {
  colors: {
    body: t('colors.gray.500'),
    link: t('colors.primary'),
    'link--active': t('colors.black'),
    button: t('colors.white'),
    divisor: t('colors.gray.300'),
  },

  backgroundColor: {
    reverse: t('colors.primary'),
    button: t('colors.primary'),
    'button--active': t('colors.primary--active'),
    aside: t('colors.pampas'),
  },

  fontSize: {
    footnote: t('fontSize.100'),
    // 200
    meta: t('fontSize.200'),
    button: t('fontSize.400'),
    // 400
    base: t('fontSize.400'),
    menu: t('fontSize.400'),
    text: t('fontSize.400'),
    // 500
    aside: t('fontSize.500'),
    // 700
    cta: t('fontSize.700'),
    'item-title': t('fontSize.700'),
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
