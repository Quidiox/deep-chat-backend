const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authRouter = require('express').Router()
const User = require('../models/User')
const config = require('../utils/config')
const cookieSettings = require('./common/cookieSettings')

authRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    const passwordsMatch =
      user === null
        ? false
        : await bcrypt.compare(req.body.password, user.passwordHash)

    if (!(user && passwordsMatch)) {
      return res.status(401).json({ error: 'invalid username or password' })
    }
    const userForToken = {
      id: user.id,
      name: user.name
    }
    const token = jwt.sign(userForToken, config.secret)
    res.cookie('token', token, cookieSettings)
    res.json({ username: user.username, name: user.name, id: user.id })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'login failed' })
  }
})

authRouter.post('/verifyAuthCookie', async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.token || !req.user) {
      return res.json({ error: 'no valid authentication cookie found!' })
    }
    const user = await User.findById(req.user.id)
    const userForToken = {
      id: user.id,
      name: user.name
    }
    const token = jwt.sign(userForToken, config.secret)
    res.cookie('token', token, cookieSettings)
    res.json({ username: user.username, name: user.name, id: user.id })
  } catch (error) {
    console.log(error)
    res.json({ error: 'no valid authentication cookie found!' })
  }
})

authRouter.post('/logout', async (req, res) => {
  try {
    res.cookie('token', '', { ...cookieSettings, maxAge: 0, overwrite: true })
    res.end()
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'logout failed' })
  }
})

module.exports = authRouter
