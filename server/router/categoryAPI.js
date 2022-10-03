const express = require('express')
const { db, genid } = require('../db/dbUtils')
// 注册路由
const router = express.Router()

// 编写路由
// 分类添加接口
router.post('/_token/add', (req, res) => {
    // 前端需要传入分类名，这里需要生成对应的id,更新数据库
    const { categoryName } = req.body
    const add_sql = 'INSERT INTO `category` (`id`,`category_name`) VALUES(?,?)'
    db.async.run(add_sql, [genid.NextId(), categoryName]).then(({ error }) => {
        if (!error) {
            res.send({
                code: 200,
                msg: '添加成功!'
            })
        } else {
            res.send({
                code: 500,
                msg: '添加失败!'
            })
        }
    })
})

// 分类删除接口
router.delete('/_token/delete', (req, res) => {
    const { id } = req.query
    const del_sql = 'DELETE FROM `category` WHERE `id` = ?'
    db.async.run(del_sql, [id]).then(({ error }) => {
        if (!error) {
            res.send({
                code: 200,
                msg: '删除成功!'
            })
        } else {
            res.send({
                code: 500,
                msg: '删除失败!'
            })
        }
    })
})

// 分类修改接口
router.put('/_token/update', (req, res) => {
    // 前端需要传入id和categoryName
    const { id, categoryName } = req.body
    const update_sql = 'UPDATE `category` set `category_name` = ? WHERE `id` = ?'
    db.async.all(update_sql, [categoryName, id]).then(({ error }) => {
        if (!error) {
            res.send({
                code: 200,
                msg: '修改成功!'
            })
        } else {
            res.send({
                code: 500,
                msg: '修改失败!'
            })
        }
    })
})

// 分类查询接口
router.get('/categorylist', (req, res) => {
    const get_sql = 'SELECT * FROM `category`'
    db.async.all(get_sql, []).then(({ error, rows }) => {
        if (!error) {
            res.send({
                code: 200,
                msg: '查询成功!',
                data: rows
            })
        } else {
            res.send({
                code: 500,
                msg: '查询失败!',
            })
        }
    })
})

module.exports = router