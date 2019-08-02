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
    res.send({
      success: true
    })
  })

  // 查询分类接口
  router.get('/', async (req, res) => {
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
    const modelName = Inflection.classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)
}