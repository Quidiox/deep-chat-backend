const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, { path: '/chat', cookie: false })
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const expressJwt = require('express-jwt')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const requireHTTPS = require('./src/middleware/requireHTTPS')
const authRouter = require('./src/controllers/auth')
const userRouter = require('./src/controllers/user')
const chatRouter = require('./src/controllers/chat')
const PORT = config.port || 3001
const corsOptions = {
  origin: config.origin,
  credentials: true,
  allowedHeaders: [
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Accept',
    'Cookie'
  ]
}
// app.use(requireHTTPS)
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
app.use(cors(corsOptions))
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
app.use('/api/chat', chatRouter)

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

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () =>
    console.log(`Deep Chat app listening on port ${PORT}`)
  )
}

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,
  server
}
