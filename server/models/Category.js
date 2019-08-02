// 引入数据库连接库
const mongoose = require('mongoose')
// 定义添加分类
const schema = new mongoose.Schema({
  name: { type: String },
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
})

module.exports = mongoose.model('Category', schema)