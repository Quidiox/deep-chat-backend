const auth = require('./auth')
const http = require('http')
const moxios = require('moxios')
const supertest = require('supertest')
const { app } = require('../../index')
const mongoose = require('mongoose')
const config = require('../../src/utils/config')

describe('User ', () => {
  let request = null
  let server = null
  let userId

  beforeAll(function(done) {
    server = app.listen(done)
    request = supertest.agent(server)
  })

  afterAll(function(done) {
    server.close(done)
  })

  test('can be created with username and password', async done => {
    const result = await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abckissa', name: 'abckissa', password: '123456' })
      .expect(200)
    userId = result.body.id
    done()
  })
  test('username is unique', async done => {
    await request
      .post('/api/user/create')
      .set('Accept', 'application/json')
      .send({ username: 'abckissa', name: 'abckissa', password: '123456' })
      .expect(409)
    done()
  })
  test(' can be deleted', async done => {
    await request.del(`/api/user/remove/${userId}`).expect(204)
    done()
  })
})
