module.exports = options => {
  const jwt = require('jsonwebtoken')
  // 用户模块
  const AdminUser = require('../models/AdminUser')
  // 验证插件
  const assert =require('http-assert')
  
  return async (req, res, next) => {
    // 获取请求头
    const token = String(req.headers.authorization || '').split(' ').pop()
    // token为空
    assert(token, 401, '请先登录')
    // 校验token，返回一个包含用户id的对象
    const { id } = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '请先登录')
    // id验证是否有该用户
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登录')
    await next()
  }
}