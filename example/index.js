const { PORT } = require('../libs/index')
const User = require('./user/index')

const config = {
  [PORT]: 3000,
  ...User
}

module.exports = config
