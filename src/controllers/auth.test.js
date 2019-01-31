const supertest = require('supertest')
const { app } = require('../../index')

describe('Authentication controller', () => {
  let request = null
  let server = null
  let userId = null

  beforeAll(done => {
    server = app.listen()
    request = supertest.agent(server)
    request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'person1', name: 'person1', password: 'password1' })
      .then(result => {
        userId = result.body.id
        done()
      })
  })
  afterAll(done => {
    request.del(`/api/user/remove/${userId}`).then(() => {
      server.close(done)
    })
  })

  test('login with valid username and password is successful', async () => {
    const result = await request
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'person1', password: 'password1' })
      .expect(200)
    console.log(result.request.cookies)
  })
  // test('Token can be used to authenticate', async () => {

  // })
  // test('Without token authentication fails', async () => {

  // })
})
