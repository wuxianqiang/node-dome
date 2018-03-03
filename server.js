const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const render = require('koa-views-render')
const mysql = require('mysql')
const Router = require('koa-router')
const static = require('koa-static')
const utils = require('./libs/common')
const app = new Koa()
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'root',
    password: '07690928wxq',
    database: 'blog'
  }
)
const router = new Router()
app.use(views(__dirname + '/templates', {
  map: {
    html: 'ejs'
  }
}));

function getData (param) {
  return new Promise((resolve, reject) => {
    db.query(param, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
router.get('/', async (ctx, next) => {
  let banners = await getData('SELECT * FROM banner_table')
  let articles = await getData('SELECT ID,title,summery FROM author_table')
  await ctx.render('index.ejs', {banners, articles})
})

router.get('/article', async (ctx, next) => {
  let {id, act} = ctx.request.query
  if (id) {
    if (act === 'like') {
      await getData(`UPDATE author_table SET n_like=n_like+1 WHERE ID=${id}`)
    }
    let data = await getData(`SELECT * FROM author_table WHERE ID=${id}`)
    let article = data[0]
    let content = utils.addHTML(article.content)
    let time = utils.formatTime(article.post_time)
    await ctx.render('context.ejs', {article, content, time})
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(static(path.resolve(__dirname, "./www")))

app.listen(8080, () => {
  console.log('port 8080!')
})

// -webkit-appearance: none取消表单的逻辑渲染