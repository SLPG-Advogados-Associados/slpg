import { Rule } from '../../lib/engine/rule'
import { dates } from '../dates'

// inherited
import { possibility as art40integral } from '../1998-ec-20/possibilities/art-40--permanent--integral'
import { possibility as art40proportional } from '../1998-ec-20/possibilities/art-40--permanent--proportional'

import { possibility as art2 } from './possibilities/art-2--transition'
import { possibility as art6 } from './possibilities/art-6--transition'

const promulgation = dates.ec41
const due = dates.ec103

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 41',
  description: 'Regra permanente como descrita na EC nº 41, de 2003',
  possibilities: [art40integral.clone(), art40proportional.clone(), art2, art6],
})

export { rule }