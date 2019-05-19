const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const User = require('../models/User')
const config = require('../utils/config')
const cookieSettings = require('./common/cookieSettings')

const validationsForCreate = [
  check('nickname')
    .isAlphanumeric()
    .withMessage('Nickname must contain only alphanumeric characters.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Nickname must be between 3-30 characters long.'),
  check('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3-30 characters long.')
    .isAlphanumeric()
    .withMessage('Username must contain only alphanumeric characters.'),
  check('password')
    .isLength({ min: 3, max: 30 })
    .withMessage('Password must be between 3-30 characters long.')
]

const validationsForEdit = [
  check('nickname')
    .isAlphanumeric()
    .withMessage('Nickname must contain only alphanumeric characters.')
    .isLength({ min: 3, max: 30 })
    .optional()
    .withMessage('Nickname must be between 3-30 characters long.'),
  check('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3-30 characters long.')
    .isAlphanumeric()
    .optional()
    .withMessage('Username must contain only alphanumeric characters.'),
  check('password')
    .isLength({ min: 3, max: 30 })
    .optional()
    .withMessage('Password must be between 3-30 characters long.')
]

userRouter.post('/create', validationsForCreate, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() })
    }
    const { username, nickname, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      nickname,
      passwordHash
    })
    const savedUser = await user.save()
    const userForToken = {
      id: savedUser.id,
      nickname: savedUser.nickname
    }
    const token = jwt.sign(userForToken, config.secret)
    res.cookie('token', token, cookieSettings)
    res.json({
      username: savedUser.username,
      nickname: savedUser.nickname,
      id: savedUser.id
    })
  } catch (error) {
    // console.log(error)
    if (error.code === 11000) {
      res.status(409).json({ error: 'username or nickname exists' })
    } else {
      res.status(500).json({ error: 'creating user failed' })
    }
  }
})

userRouter.put('/edit', validationsForEdit, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { username, nickname, password, id } = req.body
    if (req.user.id !== id) {
      return res.status(400).json({ error: 'editing user failed' })
    }
    let user = {}
    if (username) user.username = username
    if (nickname) user.nickname = nickname
    if (password) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      user.passwordHash = passwordHash
    }
    const savedUser = await User.findOneAndUpdate({ _id: id }, user, {
      new: true
    })
    const userForToken = {
      id: savedUser.id,
      nickname: savedUser.nickname
    }
    const token = await jwt.sign(userForToken, config.secret)
    res.cookie('token', token, cookieSettings)
    const userToReturn = {
      id: savedUser.id,
      nickname: savedUser.nickname,
      username: savedUser.username
    }
    res.json(userToReturn)
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'username or nickname exists' })
    } else {
      res.status(500).json({ error: 'editing user failed' })
    }
  }
})

userRouter.delete('/delete', async (req, res) => {
  try {
    if (req.user.id !== req.body.id) {
      return res.status(400).json({ error: 'error when deleting user' })
    }
    await User.findByIdAndRemove(req.body.id)
    res.status(204).end()
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: 'deleting user failed' })
  }
})

module.exports = userRouter
