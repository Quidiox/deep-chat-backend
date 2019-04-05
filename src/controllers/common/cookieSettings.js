const config = require('../../utils/config')
module.exports = {
  httpOnly: true,
  maxAge: 3600000,
  sameSite: 'Strict',
  domain: config.domain
}
