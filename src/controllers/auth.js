const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authRouter = require('express').Router()
const User = require('../models/User')
const config = require('../utils/config')

authRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    const passwordsMatch =
      user === null
        ? false
        : await bcrypt.compare(req.body.password, user.passwordHash)

    if (!(user && passwordsMatch)) {
      return res.status(401).send({ error: 'invalid username or password' })
    }
    const userForToken = {
      id: user.id
    }
    const token = jwt.sign(userForToken, config.secret)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000
    })
    res.json({ username: user.username, name: user.name, id: user.id })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'invalid login credentials' })
  }
})

authRouter.post('/verifyUser', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!req.user.id || !user) {
      res.clearCookie('token')
      res.clearCookie('io')
      return res.status(401).json({ error: 'invalid user information' })
    }
    const userForToken = {
      id: user.id
    }
    const token = jwt.sign(userForToken, config.secret)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000
    })
    res.json({ username: user.username, name: user.name, id: user.id })
  } catch (error) {
    console.log(error)
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'something went wrong...' })
    }
  }
})

authRouter.post('/logout', async (req, res) => {
  try {
    res.clearCookie('token')
    res.clearCookie('io')
    res.end()
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: error.message })
  }
})

module.exports = authRouter
