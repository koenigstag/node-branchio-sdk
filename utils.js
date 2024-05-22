'use strict'

const isNil = (value) => value === null || value === undefined
const isEmpty = (value) => isNil(value) || value === ''

const required = (param) => {
  const [key, value] = Object.entries(param)[0]

  if (isEmpty(value)) {
    throw new Error(`Parameter ${key} is required`)
  }
}

module.exports = {
  required,
  isNil,
  isEmpty,
}
