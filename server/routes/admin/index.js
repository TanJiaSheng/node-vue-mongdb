module.exports = app => {
  const express = require('express')
  // 引入路由
  const router = express.Router({
    mergeParams: true
  })
  // 引入分类接口
  // const Category = require('../../models/Category')

  const Inflection = require('inflection')

  //添加分类接口
  router.post('/', async (req, res) => {
    // req.body 提交的参数
    const model = await req.Model.create(req.body)
    res.send(model)
  })

  // 编辑分类
  router.put('/:id', async (req, res) => {
    // 两个参数 id  category
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除分类
  router.delete('/:id', async (req, res) => {
    // 两个参数 id  category
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    // 删除直接返回成功提示
    res.send({
      success: true
    })
  })

  // 查询分类接口
  router.get('/', async (req, res) => {
    // 判断引入模块名字，设置关联parent属性
    // populate('parent') 关联
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }

    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    res.send(items)
  })

  // 根据id查询分类
  router.get('/:id', async (req, res) => {
    // req.params.id   id参数获取
    const models = await req.Model.findById(req.params.id)
    res.send(models)
  })

  app.use('/admin/api/rest/:resource', async (req, res, next) => {
    // 设置自动引入模块，通过判断请求接口的来源，使用 inflection插件 转换为类模式的字符串
    const modelName = Inflection.classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    // 中间件，不用再每个接口函数都另外添加
    next()
  }, router)

  // 文件上传插件
  const multer = require('multer')
  const upload = multer({dest: __dirname + '/../../uploads'})
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

}