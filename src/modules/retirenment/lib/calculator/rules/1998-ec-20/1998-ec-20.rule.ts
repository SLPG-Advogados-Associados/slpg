import { Rule } from '../../lib/engine/rule'
import { dates } from '../dates'

const promulgation = dates.ec20
const due = dates.ec41

import { possibility as art40integral } from './possibilities/art-40--permanent--integral'
import { possibility as art40proportional } from './possibilities/art-40--permanent--proportional'
import { possibility as art8integral } from './possibilities/art-8--transition--integral'
import { possibility as art8proportional } from './possibilities/art-8--transition--proportional'

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 20',
  description: `Regra permanente e de transição, como descritas na EC nº 20, de 1998`,
  possibilities: [
    art40integral,
    art40proportional,
    art8integral,
    art8proportional,
  ],
})

export { rule }
