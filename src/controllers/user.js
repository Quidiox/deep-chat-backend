const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/User')
const config = require('../utils/config')
const { check, validationResult } = require('express-validator/check')

const validationsForCreate = [
  check('name')
    .custom(name => {
      return name.match(/^[a-zA-Z\s]+$/)
    })
    .withMessage('Name must contain only alphabetic characters.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be between 3-30 characters long.'),
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
  check('name')
    .custom(name => {
      return name.match(/^[a-zA-Z\s]+$/)
    })
    .withMessage('Name must contain only alphabetic characters.')
    .isLength({ min: 3, max: 30 })
    .optional()
    .withMessage('Name must be between 3-30 characters long.'),
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

userRouter.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      'id username name'
    )
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(400).json('failed to get user')
  }
})

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find().select('id username name')
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'failed to get all users' })
  }
})

userRouter.post('/create', validationsForCreate, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() })
    }
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
      maxAge: 3600000
    })
    res.json({
      username: savedUser.username,
      name: savedUser.name,
      id: savedUser.id
    })
  } catch (error) {
    // console.log(error)
    if (error.code === 11000) {
      res.status(409).json({ error: 'username exists' })
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
    const { username, name, password, id } = req.body
    if (req.user.id !== id) {
      return res.status(400).json({ error: 'error when editing user' })
    }
    let user = {}
    if (username) user.username = username
    if (name) user.name = name
    if (password) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      user.passwordHash = passwordHash
    }
    const savedUser = await User.findOneAndUpdate({ _id: id }, user, {
      new: true
    })
    const userForToken = {
      username: savedUser.username,
      id: savedUser.id
    }
    const token = await jwt.sign(userForToken, config.secret)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000
    })
    const userToReturn = {
      id: savedUser.id,
      name: savedUser.name,
      username: savedUser.username
    }
    res.json(userToReturn)
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'username exists' })
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
