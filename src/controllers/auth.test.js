const supertest = require('supertest')
const { app } = require('../../index')

describe('Authentication controller', () => {
  let request = null
  let server = null
  let userId = null

  beforeAll(async () => {
    server = app.listen()
    request = supertest.agent(server)
    const result = await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'person1', name: 'person1', password: 'password1' })
    userId = result.body.id
  })
  afterAll(async () => {
    console.log(userId)
    await request.del(`/api/user/remove/${userId}`)
    await server.close()
  })

  test('login with valid username and password is successful', async () => {
    await request
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'person1', password: 'password1' })
      .expect(200)
  })
})

/*describe('Authentication controller', done => {
  test('login with valid username and password is successful', async done => {
    const result = await request
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ username: 'person1', password: 'password1' })
    expect(result.status).toBe(200)
    done()
  })
  done()
  // send the token - should respond with a 200
  // test('It responds with JSON', () => {
  //   return req(server)
  //     .get('/')
  //     .set('Authorization', `Bearer ${token}`)
  //     .then((response) => {
  //       expect(response.statusCode).toBe(200);
  //       expect(response.type).toBe('application/json');
  //     });
  // });
})

// describe('Authentication', () => {
//   beforeEach(() => {
//     moxios.install()
//   })
//   afterEach(() => {
//     moxios.uninstall()
//   })
//   test('')
// })*/
