// 资源中间件
module.exports = options => {
  // 字段处理插件，可用来变类名形式
  const Inflection = require('inflection')
  return async (req, res, next) => {
    // 设置自动引入模块，通过判断请求接口的来源，使用 inflection插件 转换为类模式的字符串
    const modelName = Inflection.classify(req.params.resource)
    req.Model = require(`../models/${modelName}`)
    // 中间件，不用再每个接口函数都另外添加
    next()
  }
}