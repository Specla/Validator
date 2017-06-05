const compose = require('../compose')
const { Value } = require('../exceptions')
const { mutator, defaultValue, optional } = require('../rules')

/**
 * Number validator function
 * @param  {Object} properties
 * @param  {Mixed} value
 * @return {Function}
 */
module.exports = compose(
  defaultValue,
  mutator,
  optional,
  ({ cast, min, max, precision } = {}, value) => {
    if (cast) {
      value = Number(value)
    }

    if (
      (typeof value !== 'number' || isNaN(value)) &&
      value !== null &&
      value !== undefined
    ) {
      throw new Error(`isn't a number`)
    }

    if (min && min > value) {
      throw new Error(`is below the minimum`)
    }

    if (max && max < value) {
      throw new Error(`is above the maximum`)
    }

    if (precision && String(value) !== value.toFixed(precision)) {
      throw new Error(`number isn't the correct precision`)
    }

    if (cast) {
      throw new Value(value)
    }

    return true
  }
)