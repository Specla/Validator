/* eslint-env mocha */

const { expect } = require('chai')
const Validator = require('../lib/Validator')
const { string } = require('../lib/types')

describe('Validator', () => {
  it('Should validate a value against a type', () => {
    const validator = new Validator('string', String)
    expect(validator.errors).to.be.deep.equal({})
  })

  it('Should validate a value against a schema object', () => {
    const value = { string: 'string', number: 20 }
    const schema = { string: String, number: Number }
    const validator = new Validator(value, schema)
    expect(validator.errors).to.be.deep.equal({})
  })

  it('Should validate a value against a schema array', () => {
    const value = [{ string: 'string', number: 20 }]
    const schema = [{ string: String, number: Number }]
    const validator = new Validator(value, schema)
    expect(validator.errors).to.be.deep.equal({})
  })

  it(`Should tell object is required when undefined or null is given as the value`, () => {
    const schema = { string: String }
    const error = { '': `isn't an object` }
    let validator = new Validator(undefined, schema)
    expect(validator.errors).to.be.deep.equal(error)
    validator = new Validator(null, schema)
    expect(validator.errors).to.be.deep.equal(error)
  })

  it(`Should tell array is required when undefined or null is given as the value`, () => {
    const schema = [{ string: String }]
    const error = { '': `isn't an array` }
    let validator = new Validator(undefined, schema)
    expect(validator.errors).to.be.deep.equal(error)
    validator = new Validator(null, schema)
    expect(validator.errors).to.be.deep.equal(error)
  })

  it(`Should tell if a value isn't defined in the schema`, () => {
    let validator = new Validator({ string: 'string' }, {})
    expect(validator.errors).to.be.deep.equal({
      string: `isn't defined in the schema`
    })

    validator = new Validator([{ string: 'string' }], [{}])
    expect(validator.errors).to.be.deep.equal({
      '0.string': `isn't defined in the schema`
    })
  })

  it('Should set a default value if the input is undefined or null', () => {
    const value = { string: undefined }
    const validator = new Validator( // eslint-disable-line
      value,
      { string: string({ defaultValue: 'string' }) }
    )

    expect(value.string).to.be.equal('string')
  })

  it('Should mutate data through a mutator function', () => {
    const value = { string: 'string' }
    const validator = new Validator( // eslint-disable-line
      value,
      { string: string({ mutator: value => 'new string' }) }
    )

    expect(value.string).to.be.equal('new string')
  })

  it('Should .fails() return true if any errors where encountered', () => {
    let validator = new Validator(1, String)
    expect(validator.fails()).to.be.equal(true)
    validator = new Validator('string', String)
    expect(validator.fails()).to.be.equal(false)
  })

  it('Should be able to listen for errors as an option on the validator', () => {
    const value = { number: '10' }
    const schema = { number: Number }
    const validator = new Validator(value, schema, {
      onError: err => {
        expect(err).to.be.deep.equal({
          context: ['number'],
          message: `isn't a number`,
          value: '10'
        })
      }
    })

    expect(validator.errors).to.be.deep.equal({
      number: `isn't a number`
    })
  })
})
