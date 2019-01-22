const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, { path: '/server' })
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const expressJwt = require('express-jwt')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const requireHTTPS = require('./src/middleware/requireHTTPS')
const socketConfig = require('./src/socketio/socketConfig')
const authRouter = require('./src/controllers/auth')
const userRouter = require('./src/controllers/user')
const PORT = config.port || 3001

app.use(requireHTTPS)
mongoose.connect(
  config.mongoURI,
  {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true
  }
)
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise

app.disable('x-powered-by')
app.use(cors({ origin: config.origin, credentials: true }))
/* Some helmet configuration needed. 
   Run securityheaders.io to see how security could be improved */
app.use(helmet())
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
  expressJwt({
    secret: config.secret,
    getToken: function fromCookie(req) {
      if (req.cookies && req.cookies.token) return req.cookies.token
      else return null
    }
  }).unless({
    path: ['/api/auth/login', '/api/user/create']
  })
)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

/* socket.io configuration 
   This stuff needs to be configured after some basic frontend and backend things are done.
   Athentication token from cookie should be checked with every request.
*/
app.use((req, res, next) => {
  io.use(
    expressJwt({
      secret: config.secret,
      getToken: function fromCookie() {
        if (req.cookies && req.cookies.token) return req.cookies.token
        else return null
      }
    })
  )
  next()
})

server.listen(PORT, () =>
  console.log(`Deep Chat app listening on port ${PORT}`)
)

server.on('close', () => {
  mongoose.connection.close()
})

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err)
    return res.status(401).json({ error: 'token invalid or missing' })
  }
  next()
})

app.use(function(err, req, res, next) {
  if (!err) return next()
  console.log(err)
  return res.status(500).send('internal server error')
})

module.exports = {
  app,
  server
}
