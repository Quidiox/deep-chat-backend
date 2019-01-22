if (process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGODB_URI,
  secret: process.env.SECRET,
  origin: process.env.CORS_ORIGIN,
  domain: process.env.DOMAIN
}
