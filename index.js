const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server, { path: '/server' })
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./utils/config')
const socketConfig = require('./socketio/socketConfig')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/user')
const PORT = config.port || 3001

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

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
  jwt({
    secret: config.secret,
    getToken: function fromCookie(req) {
      if (req.cookies && req.cookies.authToken) return req.cookies.authToken
    }
  }).unless({
    path: ['/api/auth/login', '/api/user/create']
  })
)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

socketConfig(io)

server.listen(PORT, () =>
  console.log(`Deep Chat app listening on port ${PORT}`)
)

server.on('close', () => {
  mongoose.connection.close()
})

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err)
    res.status(401).json({ error: 'token invalid or missing' })
  }
  next(err)
})

app.use(function(err, req, res, next) {
  if (!err) return next()
  console.log(err)
  res.status(500).send('internal server error')
})

module.exports = {
  app,
  server
}
