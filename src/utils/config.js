if (process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports =
  process.env.NODE_ENV === 'test'
    ? {
        port: process.env.TEST_PORT,
        mongoURI: process.env.MONGODB_URI,
        secret: process.env.SECRET,
        origin: process.env.CORS_ORIGIN,
        domain: process.env.DOMAIN
      }
    : {
        port: process.env.PORT,
        mongoURI: process.env.MONGODB_URI,
        secret: process.env.SECRET,
        origin: process.env.CORS_ORIGIN,
        domain: process.env.DOMAIN
      }
