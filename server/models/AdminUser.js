const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    // 配置密码不可查找
    select: false,
    set(val) {
    return require('bcrypt').hashSync(val, 10)
  } },
  phone: { type: Number },
  email: { type: String },
  avatar: { type: String }
})

module.exports = mongoose.model('AdminUser', schema)