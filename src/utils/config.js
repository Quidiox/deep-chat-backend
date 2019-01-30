if (process.env.NODE_ENV !== 'production') require('dotenv').config()
let settings
if (process.env.NODE_ENV === 'test') {
  settings = {
    port: process.env.TEST_PORT,
    mongoURI: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    origin: process.env.CORS_ORIGIN,
    domain: process.env.DOMAIN
  }
} else {
  settings = {
    port: process.env.PORT,
    mongoURI: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    origin: process.env.CORS_ORIGIN,
    domain: process.env.DOMAIN
  }
}

module.exports = settings
