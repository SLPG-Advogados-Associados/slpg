const R = require('ramda')
const defaultTheme = require('tailwindcss/defaultTheme')

const t = path => theme => R.path(path.split('.'), theme)

const initial = {
  colors: {
    black: '#010101',

    gray: {
      default: '#7F7F7F',
      500: '#bcbcbd',
      700: '#6b6c6d',
    },
  },
}

const functional = {
  colors: {
    body: t('colors.gray.500'),
    heading: t('colors.gray.700'),
  },
}

const extend = [initial, functional].reduce((theme, curr) => {
  for (const key in curr) {
    let val = curr[key]

    // resolver
    if (typeof val === 'function') val = val(theme)

    // found scalar
    if (typeof val !== 'object') {
      theme[key] = val
      continue
    }

    // ensure structure
    theme[key] = theme[key] || {}

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
  }

  return theme
}, defaultTheme)

module.exports = {
  theme: { extend },
  variants: {},
  plugins: [],
}
