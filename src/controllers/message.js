const messageRouter = require('express').Router()
const Channel = require('../models/Channel')
const Message = require('../models/Message')
const socketConfig = require('../socketio/socketConfig')

messageRouter.get('/', async (req, res) => {})

module.exports = messageRouter
