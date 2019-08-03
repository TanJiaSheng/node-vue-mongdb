// 引入数据库连接库
const mongoose = require('mongoose')
// 定义添加物品
const schema = new mongoose.Schema({
  name: { type: String },
  icon: { type: String }
})

module.exports = mongoose.model('Item', schema)