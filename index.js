const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http, { path: '/server' })
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./utils/config')
const socketConfig = require('./src/socketConfig')
const PORT = config.port || 3001

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

socketConfig(io)

http.listen(PORT, () => console.log(`Deep Chat app listening on port ${PORT}`))
