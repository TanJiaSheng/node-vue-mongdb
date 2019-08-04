module.exports = app => {
  const router = require('express').Router()
  const mongoose = require('mongoose')
  const Category = mongoose.model('Category')
  const Article = mongoose.model('Article')

  // 导入新闻
  router.get('/news/init', async (req, res) => {
    // 找出新闻资讯
    const parent = await Category.findOne({
      name: '新闻资讯'
    })
    // lean() 从lean启用了选项的查询返回的文档是纯JavaScript对象，而不是Mongoose Documents
    const cats = await Category.find().where({
      parent
    }).lean()
    const newsTitle = ["2019Chinajoy王者PK赛，十大明星主播巅峰对决", "《王者荣耀》公布 “天工”编辑器，即将上线王者模拟战", "《圣斗士星矢（腾讯）》周年庆重磅上线！巅峰赛事爆燃开启", "新英雄马超、ChinaJoy峡谷开放日...本文信息量有点大！", "传说级FMVP皮肤曝光！将军与公主，王者峡谷年度情感大戏上演~", "7月30日全服不停机更新公告", "8月2日体验服停机更新公告", "体验服【资格申请活动】即将开启", "7月31日体验服停机更新公告", "8月1日体验服停机更新公告", "世界冠军杯 集卡赢壕礼活动公告", "炎炎夏日全新活动周 峡谷激战得好礼", "助力世冠赛 心愿单升级回馈公告", "夏日福利继续领 限定皮肤返场", "【稷下的神秘档案】活动公告", "你是赛评师：eStarPro强势进军世冠总决赛，深圳遭遇RW胜率有多少？", "【世冠今日预报】eStarPro vs RNG.M，宿敌与命运", "第二周五省齐开战，王者荣耀城市赛省赛进行中！", "世冠四强出炉 8月2日半决赛拉开战幕", "世冠总决赛门票已售罄，8月10日不见不散，感恩有你！"]
    // 随机选取分类
    const newsList = newsTitle.map(title => {
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      return {
        categories: randomCats.slice(0, 2),
        title,
      }
    })
    // 清空数据库
    await Article.deleteMany({})
    // 重新插入
    await Article.insertMany(newsList)
    res.send(newsList)
  })

  // 新闻列表
  router.get('/news/list', async (req, res) => {
    // 关联查询
    // const parent = await Category.findOne({
    //   name: '新闻资讯'
    // }).populate({ //关联
    //     path: 'children',
    //     populate: {
    //       path: 'newsList'
    //     }
    // }).lean()

    // 聚合查询
    const parent = await Category.findOne({
      name: '新闻资讯'
    })
    const cats = await Category.aggregate([
      // 1.过滤数据
      { $match: { parent: parent._id } },
      // 2. 关联查询
        { 
          $lookup: {
            from: 'articles',
            localField: '_id',
            foreignField: 'categories',
            as: 'newsList'
          }
        },
        {
          $addFields: {
            // 3. 限制只查5个
            newsList: { $slice: ['$newsList',5] }
          }
        }
    ])
    const subCats = cats.map(v => v._id)
    cats.unshift({
      name: '热门',
      newsList: await Article.find().where({
        categories: { $in: subCats }
      }).populate('categories').limit(5).lean()
    })
    // 遍历对象给newsList加入categoryName
    cats.map(cat => {
      cat.newsList.map(news => {
        // 选取字段名
        news.categoryName = (cat.name === '热门') ? news.categories[0].name : cat.name
        return news
      })
      return cat
    })
    res.send(cats)
  })
  app.use('/web/api', router)
}

