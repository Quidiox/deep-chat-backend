const supertest = require('supertest')
const { app } = require('../../index')

describe('Authentication controller', () => {
  let request = null
  let server = null
  let userId = null
  let cookie = null

  beforeAll(done => {
    server = app.listen()
    request = supertest(server)
    request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({
        username: 'authTestUser',
        name: 'person1',
        password: 'password1'
      })
      .then(res => {
        userId = res.body.id
        cookie = res.headers['set-cookie']
        done()
      })
  })
  afterAll(done => {
    request
      .del(`/api/user/remove/${userId}`)
      .set('Cookie', cookie)
      .then(() => {
        server.close(done)
      })
  })

  test('login with valid username and password is successful', async () => {
    await request
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'authTestUser', password: 'password1' })
      .expect(200)
  })
  test('With valid token authentication succeeds', async () => {
    const response = await request
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'authTestUser', password: 'password1' })
      .expect(200)

    await request
      .post('/api/auth/verifyUser')
      .set('Cookie', response.headers['set-cookie'])
      .expect(200)
  })
  test('Without token authentication fails and error code is 401', async () => {
    await request
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'authTestUser', password: 'password1' })
      .expect(200)

    await request.post('/api/auth/verifyUser').expect(401)
  })
})
