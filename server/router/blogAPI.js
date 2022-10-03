
const express = require('express')
const { db, genid } = require('../db/dbUtils')
const dayjs = require('dayjs')
// 创建路由
const router = express.Router()

// 编写路由
// 添加博客的接口
router.post('/_token/add', (req, res) => {
    const { title, content, categoryId } = req.body
    const id = genid.NextId()
    const createTime = new Date().getTime()
    const update_sql = "INSERT INTO `blog` (`id`,`title`,`content`,`category_id`,`create_time`) VALUES (?,?,?,?,?)"
    db.async.run(update_sql, [id, title, content, categoryId, createTime]).then(({ error }) => {
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

// 删除博客的接口
router.delete('/_token/delete', (req, res) => {
    const { id } = req.query
    const del_sql = "DELETE FROM blog WHERE id = ?"
    db.async.run(del_sql, [id]).then(({ error }) => {
        if (!error) {
            res.send({
                code: 200,
                msg: '删除成功!'
            })
        } else {
            res.send({
                code: 500,
                msg: '删除失败!',
                error
            })
        }
    })
})

// 修改博客的接口
router.put('/_token/update', (req, res) => {
    const { id, title, content, categoryId } = req.body
    const update_sql = "UPDATE blog SET title = ? , content = ? ,category_id = ?,create_time = ? WHERE id = ?"
    const createTime = new Date().getTime()
    db.async.run(update_sql, [title, content, categoryId, createTime, id]).then(({ error }) => {
        if (!error) {
            res.send({
                code: 200,
                msg: '修改成功!'
            })
        } else {
            res.send({
                code: 500,
                msg: '修改失败!',
                error
            })
        }
    })
})

// 查询博客的接口
// 这一块需要考虑的地方很多
router.get('/search', async (req, res) => {
    let { keyword, page, pageSize, categoryId } = req.query
    keyword = keyword === undefined ? '' : keyword
    page = page === undefined ? 1 : Number(page)
    pageSize = pageSize === undefined ? 10 : Number(pageSize)
    categoryId = categoryId === undefined ? 0 : Number(categoryId)
    // 2. 在这里需要去拼接sql语句和参数
    let params = []
    let whereSql = []

    // 判断是否选择分类
    if (categoryId != 0) {
        // 这里注意前后留空格，避免拼接的时候出现很多的问题
        whereSql.push(" category_id = ? ")
        params.push(categoryId)
    }

    // 判断是否传入关键字
    if (keyword != '') {
        // 只要在title和content中有出现过的都筛选出来
        whereSql.push(" (title LIKE ? OR content LIKE ?) ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    // 判断是否有传入筛选的条件
    let whereSqlStr = ''
    if (whereSql.length) {
        // 筛选条件在进行拼接
        whereSqlStr = " WHERE" + whereSql.join(' AND ')
    }

    // 整合全部条件和参数
    let str = "SELECT * FROM blog" + whereSqlStr + " ORDER BY create_time DESC LIMIT ?,? "
    // 这里多了两个参数，用于限制页码
    /*
        limit 0 10 表示的是从第0条开始，展示10个内容
        page      1      2       3
        pageSize  10     10      10
        limit   0 10   10 10   20 10
    */
    let searchParams = params.concat([(page - 1) * pageSize, pageSize])

    // 计算出总的符合条件的信息条数
    let totalSql = "SELECT count(*) FROM blog" + whereSqlStr

    // 查询符合条件的数据
    let searchData = await db.async.all(str, searchParams)

    // 查询总的信息数
    let total = await db.async.all(totalSql, params)

    if (searchData.error == null && total.error == null) {
        res.send({
            code: 200,
            msg: '查询成功！',
            data: {
                keyword,
                page,
                pageSize,
                categoryId,
                rows: searchData.rows,
                total: total.rows[0]['count(*)']
            }
        })
    } else {
        res.send({
            code: 500,
            msg: '查询失败！'
        })
    }
})


// 查询内容详情
router.get('/detail',(req,res) =>{
    const {id} = req.query
    const detail_sql = 'SELECT * FROM blog WHERE id = ?'
    db.async.all(detail_sql,[id]).then(({error,rows}) =>{
        if(!error){
            res.send({
                code:200,
                msg:'查询成功',
                data:rows
            })
        }else{
            res.send({
                code:500,
                msg:'查询失败'
            })
        }
    })
})

module.exports = router