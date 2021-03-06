const compose = require('../compose')
const { mutator, defaultValue, optional } = require('../rules')
const locale = require('../locale')

/**
 * Date validator function
 * @param  {Object} properties
 * @param  {Mixed} value
 * @param  {Object|Array} schema
 * @return {Function}
 */
module.exports = compose(
  defaultValue,
  mutator,
  optional,
  ({ min, max } = {}, value) => {
    if (!(value instanceof Date) && value !== null && value !== undefined) {
      throw new Error(locale().date.type)
    }

    if (min) {
      if (!(min instanceof Date)) {
        throw new Error(`min property should be a date object`)
      }

      if ((+min) > (+value)) {
        throw new Error(locale().date.min)
      }
    }

    if (max) {
      if (!(max instanceof Date)) {
        throw new Error(`max property should be a date object`)
      }

      if ((+max) < (+value)) {
        throw new Error(locale().date.max)
      }
    }

    return true
  }
)
