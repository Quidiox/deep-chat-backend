const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/User')
const config = require('../utils/config')

userRouter.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      'id username name'
    )
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed to get user' })
  }
})

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('id username name')
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed to get all users' })
  }
})

userRouter.post('/create', async (req, res) => {
  try {
    const { username, name, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })
    const savedUser = await user.save()
    const userForToken = {
      username: savedUser.username,
      id: savedUser.id
    }
    const token = jwt.sign(userForToken, config.secret)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000
    })
    res.json({
      username: savedUser.username,
      name: savedUser.name,
      id: savedUser.id
    })
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(409).json({ error: 'username exists' })
    } else {
      res.status(500).json({ error: 'creating user failed' })
    }
  }
})

module.exports = userRouter
