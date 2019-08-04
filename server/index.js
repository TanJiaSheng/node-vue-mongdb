const express = require('express')
const app = express()

// 设置全局字段（用于设置token）
app.set('secret', '1fvfjy3frq6zf56ef')

// 启用跨域
app.use(require('cors')())
// 格式化为json格式
app.use(express.json())
// 静态托管
app.use('/uploads', express.static(__dirname + '/uploads'))


// 引入数据库连接文件
require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)

// 启动3000端口
app.listen(3000, () => {
  console.log('http://localhost:3000')
})