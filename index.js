const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, { path: '/chat', cookie: false })
const jwt = require('jsonwebtoken')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const expressJwt = require('express-jwt')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const authRouter = require('./src/controllers/auth')
const userRouter = require('./src/controllers/user')
const channelController = require('./src/controllers/channel')
const messageController = require('./src/controllers/message')
// const requireHTTPS = require('./src/middleware/requireHTTPS')
// const socketConfig = require('./src/socketio/socketConfig')
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

io.use((socket, next) => {
  if (
    socket.request.headers.cookie &&
    socket.request.headers.cookie.split('=')[0] === 'token'
  ) {
    try {
      const decoded = jwt.verify(
        socket.request.headers.cookie.split('=')[1],
        config.secret
      )
      console.log(`User with id: ${decoded.id} connected.`)
      return next()
    } catch (error) {
      console.log(error)
    }
  }
  console.log('Access denied. Token invalid or missing.')
  socket.emit('authError', 'Access denied. Token invalid or missing.')
  socket.disconnect()
  next(new Error('Authentication error'))
})

io.on('connection', socket => {
  console.log('a user connected')
  socket.on('clientConnected', message => console.log(message))
  socket.emit('serverConnected', `Connection to server successful.`)
  socket.once('user', user => {
    socket.user = user
    // console.log(socket.user)
  })
  // Chatroom specific events
  socket.on('join channel', async data => {
    const channel = await channelController.post(data.name, socket.user.id)
    socket.join(channel.name, () => {
      let rooms = Object.keys(socket.rooms)
      console.log(rooms)
      io.to(channel.name).emit(
        `${user.name} has joined channel ${channel.name}`
      )
    })
  })

  socket.on('leave channel', () => {})

  socket.on('new message', data => {
    socket.broadcast.emit('new message', {
      username: data.username,
      message: data.message
    })
  })

  socket.on('create', () => {})

  socket.on('delete', () => {})

  socket.on('chatroomUsers', () => {})

  socket.on('availableUsers', () => {})

  socket.on('disconnect', () => {})

  socket.on('error', () => {})

  server.on('close', () => {
    socket.disconnect()
  })
})

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err)
    return res.status(401).json({ error: 'Token invalid or missing.' })
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
