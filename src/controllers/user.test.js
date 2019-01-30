const supertest = require('supertest')
const { app } = require('../../index')

describe('User controller', () => {
  let request = null
  let server = null
  let userId = null

  beforeAll(() => {
    server = app.listen()
    request = supertest.agent(server)
  })
  afterAll(async () => {
    await server.close()
  })

  test('user can be created with username and password', async () => {
    const result = await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abckissa', name: 'abckissa', password: '123456' })
      .expect(200)
    userId = result.body.id
  })
  test('username is unique', async () => {
    await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abckissa', name: 'abckissa', password: '123456' })
      .expect(409)
  })
  test('user can be deleted', async () => {
    await request.del(`/api/user/remove/${userId}`).expect(204)
  })
})
