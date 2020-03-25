const { mock } = require('../../libs/index');

module.exports = {
  'GET /users': () => {
    return {
      users: mock.array( {
        id: mock.uuid(),
        name: mock.fullName()
      }, 0, 5 )
    }
  },
  'GET /users/:id': () => {
    return {
      id: mock.uuid(),
      name: mock.fullName(),
      age: mock.integer(1, 60)
    }
  }
}
