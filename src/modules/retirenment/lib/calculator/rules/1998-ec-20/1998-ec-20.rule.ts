import { Rule } from '../../lib/engine/rule'
import { dates } from '../dates'

const promulgation = dates.ec20
const due = dates.ec41

import { possibility as permanentIntegral } from './possibilities/art-40--permanent--integral'
import { possibility as permanentProportional } from './possibilities/art-40--permanent--proportional'
import { possibility as transitionIntegral } from './possibilities/art-8--transition--integral'
import { possibility as transitionProportional } from './possibilities/art-8--transition--proportional'

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 20',
  description: `Regra permanente e de transição, como descritas na EC nº 20, de 1998`,
  possibilities: [
    permanentIntegral,
    permanentProportional,
    transitionIntegral,
    transitionProportional,
  ],
})

export { rule }
