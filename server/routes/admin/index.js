module.exports = app => {
  const express = require('express')
  // toekn 加工插件
  const jwt = require('jsonwebtoken')
  // 用户模块
  const AdminUser = require('../../models/AdminUser')
  // 验证插件
  const assert =require('http-assert')
  // 引入路由
  const router = express.Router({
    mergeParams: true
  })

  // 创建资源
  router.post('/', async (req, res) => {
    // req.body 提交的参数
    const model = await req.Model.create(req.body)
    res.send(model)
  })

  // 编辑资源
  router.put('/:id', async (req, res) => {
    // 两个参数 id  category
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除资源
  router.delete('/:id', async (req, res) => {
    // 两个参数 id  category
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    // 删除直接返回成功提示
    res.send({
      success: true
    })
  })

  // 资源列表
  router.get('/', async (req, res) => {
    // 判断引入模块名字，设置关联parent属性
    // populate('parent') 关联
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }

    const items = await req.Model.find().setOptions(queryOptions).limit(100)
    res.send(items)
  })

  // 资源详情
  router.get('/:id', async (req, res) => {
    // req.params.id   id参数获取
    const models = await req.Model.findById(req.params.id)
    res.send(models)
  })

  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth')

  // 资源中间件
  const resourceMiddleware = require('../../middleware/resource')

  // 资源通用接口
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

  // 文件上传插件
  const multer = require('multer')
  const upload = multer({dest: __dirname + '/../../uploads'})
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // 登录接口
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    // 1. 根据用户名找用户
    // select('+password') 查询出密码（由于前面设置select: false 不可查）
    const user = await AdminUser.findOne({username}).select('+password')
    assert(user, 442, '用户不存在')
  
    // 2. 校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    
    // 3. 返回token
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    res.send({
      data: {
        id: user._id,
        username: user.username
      },
      meta: {
          status: 200
      },
      token
    })
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}