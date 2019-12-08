import { Router } from 'next/router'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

// eslint-disable-next-line no-undef
Router.events.on('routeChangeComplete', () => window.scrollTo(0, 0))

if (process.browser) {
  // prevent navigation when href is "empty"
  window.addEventListener('click', e => {
    if ((e.target as HTMLAnchorElement).getAttribute('href') === '#') {
      e.preventDefault()
    }
  })
}
