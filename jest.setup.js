/* eslint-disable */

jest.mock('./src/modules/retirenment/lib/calculator/lib/const', () => ({
  ...jest.requireActual('./src/modules/retirenment/lib/calculator/lib/const'),
  TODAY: new Date('2020'),
}))
