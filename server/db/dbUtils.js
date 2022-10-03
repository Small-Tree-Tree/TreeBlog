const sqlite3 = require('sqlite3').verbose()
const Genid = require('../utils/SnowFlake')
const path = require('path')

// 连接数据库
const db = new sqlite3.Database(path.join(__dirname,'blogData.sqlite3'))

// 对db身上的方法进行封装
db.async = {}
db.async.all = (select,params)=>{
    return new Promise((resolve,reject)=>{
        db.all(select,params,(error,rows)=>{
            resolve({error,rows})            
        })
    })
}

db.async.run = (select,params)=>{
    return new Promise((resolve,reject)=>{
        db.run(select,params,(error,rows)=>{
            resolve({error,rows})            
        })
    })
}

// 生成雪花
const genid = new Genid({WorkerId:1})


module.exports = {db,genid}
