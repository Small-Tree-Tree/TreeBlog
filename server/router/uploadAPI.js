/*
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-27 22:09:41
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-09-27 22:36:40
 * @FilePath: \TreeBlogServer\server\router\uploadAPI.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express')
const { db, genid } = require('../db/dbUtils')
const fs = require('fs')
// 创建路由
const router = express.Router()

// 编写路由
router.post('/filelist', (req, res) => {
    // 这里需要指定格式因为使用的wangeditor，文档中说明 https://www.wangeditor.com/
    // 上传成功的返回格式：
    // {
    //     "errno": 0, // 注意：值是数字，不能是字符串
    //     "data": {
    //         "url": "xxx", // 图片 src ，必须
    //         "alt": "yyy", // 图片描述文字，非必须
    //         "href": "zzz" // 图片的链接，非必须
    //     }
    // }
    // 上传失败的返回格式：

    // {
    //     "errno": 1, // 只要不等于 0 就行
    //     "message": "失败信息"
    // }

    if (!req.files) {
        res.send({
            errno: 1,
            message: '上传失败！'
        })
        return
    }

    let files = req.files
    let list = []
    for (let file of files) {
        // 提取出后缀名
        let file_x = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)

        // 随机文件名
        let file_name = genid.NextId() + '.' + file_x

        // 移动文件并且改名
        // process.cwd() : 当前node.js进程下的工作目录
        // __dirname : 当前模块下的绝对路径
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name,
        )
        // 存放新地址,在app.js中设置静态资源的指向
        list.push("/upload/" + file_name)
    }

    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url":list[0], // 图片 src ，必须
        }
    })
})

module.exports = router