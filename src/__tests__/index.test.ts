import * as notus from '../index'
import { validator } from '../validator'

describe('index', () => {
  it('should compile', () => {
    expect(notus.validator).toEqual(validator)
  })
})
