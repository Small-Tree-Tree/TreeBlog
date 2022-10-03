/*
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-30 22:03:16
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-03 14:57:18
 * @FilePath: \TreeBlogServer\client\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter,createWebHistory,RouteRecordRaw } from "vue-router"

const routes:Array<RouteRecordRaw> = [
    {
        path:'/',
        component:()=>import('../views/home.vue')     
    },
    {
        path:'/login',
        component:()=>import('../views/login.vue')
    },
    {
        path:"/detail",
        component:()=>import('../views/detail.vue')
    },
    {
        path:'/blog',
        redirect:'/blog/article',
        component:()=>import('../views/Blog/index.vue'),
        children:[
            {
                path:'category',
                component:()=>import('../views/Blog/category.vue')
            },
            {
                path:'article',
                component:()=>import('../views/Blog/article.vue')
            }
        ]
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router