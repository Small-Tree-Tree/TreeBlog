/*
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-25 17:17:18
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-09-29 21:45:01
 * @FilePath: \TreeBlogServer\server\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express')
const multer = require('multer')
const { db, genid } = require('./db/dbUtils')
const path = require('path')
const port = 8888
const app = express()

// 配置跨域相关
app.use(function (req, res, next) {
    // 允许跨域域名
    res.header('Access-Control-Allow-Origin', '*')
    // 允许 header类型
    res.header('Access-Control-Allow-Headers', '*')
    // 允许请求方式类型
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE')
    if (req.method == 'OPTION') {
        // 让options尝试请求快速结束
        res.sendStatus(200)
    } else {
        next()
    }
})

// 对格式为JSON的body数据进行解析
app.use(express.json())

// 支持使用上传的中间件
app.use(multer({
    dest: "./public/upload/temp"
}).any())

// 指定静态资源路径
app.use(express.static(path.join(__dirname, 'public')))

// 使用中间件对token进行校验
// 把需要校验的接口前面加上_token
const keyword_token = '/_token'
app.all('*', (req, res, next) => {
    if (req.path.indexOf(keyword_token) > -1) {
        const { token } = req.headers
        db.async.all("SELECT * FROM admin WHERE token = ? ", [token]).then(({ error, rows }) => {
            if (error != null || rows.length <= 0) {
                res.send({
                    code: 403,
                    msg: '请先登录！'
                })
            } else {
                next()
            }
        })
    } else {
        next()
    }
})

// 注册路由
app.use('/admin', require('./router/loginAPI'))
app.use('/category', require('./router/categoryAPI'))
app.use('/blog', require('./router/blogAPI'))
app.use('/upload', require('./router/uploadAPI'))

app.get('/', (req, res) => {
    res.send('xxxx')
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})