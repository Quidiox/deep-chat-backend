const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const PORT = config.port || 3001

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

io.on('connection', socket => {
  console.log('a user connected')
})

http.listen(PORT, () => console.log(`Deep Chat app listening on port ${PORT}`))
