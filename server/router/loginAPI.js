const express = require('express')
const {v4:uuidv4} = require('uuid')
const {db,genid}  = require('../db/dbUtils')

// 创建路由
const router = express.Router()

// 编写路由
router.post('/login',(req,res)=>{
    // 解构出前端传入的数据
    const {account,password} = req.body
    // 需要去数据库中查找是否存在该用户
    db.async.all('SELECT * FROM admin WHERE account = ? AND password = ?',[account,password]).then(({error,rows})=>{
        if(!error && rows.length){
            // 查到此用户,需要去更新数据库中token的值并且需要将数据返回给前端
            let token = uuidv4()
            // 更新数据库
            db.async.run('UPDATE admin SET token = ? WHERE id = ?',[token,rows[0].id])
            // 返回数据给前端
            const Info = rows[0]
            Info.password = null
            Info.token = token
            res.send({
                code:200,
                msg:'登陆成功！',
                data:Info
            })
        }else{
            // 查不到用户
            res.send({
                code:500,
                msg:'登陆失败！'
            })
        }
    })
})


module.exports = router