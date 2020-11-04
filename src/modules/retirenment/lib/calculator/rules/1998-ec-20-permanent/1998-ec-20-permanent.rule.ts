import { Rule } from '../../lib/engine/rule'
import { dates } from '../dates'

const promulgation = dates.ec20
const due = dates.ec41

import { possibility as integral } from './possibilities/1998-ec-20-pemanent--art-40--integral'
import { possibility as proportional } from './possibilities/1998-ec-20-pemanent--art-40--proportional'

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 20 - Regra Permanente',
  description: 'Regra permanente como descrita na EC nº 20, de 1998',
  possibilities: [integral, proportional],
})

export { rule }
