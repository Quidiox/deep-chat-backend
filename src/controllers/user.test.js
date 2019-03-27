const supertest = require('supertest')
const { app } = require('../../index')

describe('User controller', () => {
  let request = null
  let server = null
  let userId = null

  beforeAll(done => {
    server = app.listen()
    request = supertest.agent(server)
    done()
  })
  afterAll(done => {
    server.close(done)
  })

  test('user can be created with username and password', async () => {
    const result = await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'userTestUser', name: 'User Test', password: '123456' })
      .expect(200)
    userId = result.body.id
  })
  test('username is unique', async () => {
    await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'userTestUser', name: 'User Test', password: '123456' })
      .expect(409)
  })
  test('user can be deleted', async () => {
    await request.del(`/api/user/remove/${userId}`).expect(204)
  })
  test('name must be at least 3 characters long', () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abc', name: 'Us', password: '123456' })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Name must be between 3-30 characters long.'
        )
      })
  })
  test('name must be at most 30 characters long', () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({
        username: 'abc',
        name: 'abcdefghijABCDEFGHIJabcdefghijA',
        password: '123456'
      })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Name must be between 3-30 characters long.'
        )
      })
  })
  test('username must be at least 3 characters long', () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'ab', name: 'Test User', password: '123456' })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Username must be between 3-30 characters long.'
        )
      })
  })
  test('username must be at most 30 characters long', () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({
        username: 'abcdefghijABCDEFGHIJabcdefghijA',
        name: 'abc',
        password: '123456'
      })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Username must be between 3-30 characters long.'
        )
      })
  })
  test('password length must be at least 3 characters long', () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({
        username: 'abc',
        name: 'abc',
        password: '1!'
      })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Password must be between 3-30 characters long.'
        )
      })
  })
  test('password length must be at most 30 characters long', () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({
        username: 'abc',
        name: 'abc',
        password: 'abcdefghijABCDEFGHIJabcdefghijA'
      })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Password must be between 3-30 characters long.'
        )
      })
  })
  test('name contains only alphabetic characters', async () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abc', name: 'Us!', password: '123456' })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Name must contain only alphabetic characters.'
        )
      })
  })
  test('username contains only alphanumeric characters', async () => {
    return request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abc1%', name: 'abc', password: '123456' })
      .expect(422)
      .then(res => {
        expect(res.body.errors[0].msg).toBe(
          'Username must contain only alphanumeric characters.'
        )
      })
  })
})
