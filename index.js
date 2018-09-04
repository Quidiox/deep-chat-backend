const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const app = express()
const PORT = config.post || 3001

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Deep Chat app listening on port ${PORT}` ))
