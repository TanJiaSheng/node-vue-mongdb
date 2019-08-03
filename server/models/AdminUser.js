const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    select: false,
    set(val) {
    return require('bcrypt').hashSync(val, 10)
  } },
  phone: { type: Number },
  email: { type: String }
})

module.exports = mongoose.model('AdminUser', schema)