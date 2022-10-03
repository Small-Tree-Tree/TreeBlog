<!--
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-30 22:03:17
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-03 11:43:11
 * @FilePath: \TreeBlogServer\client\src\views\Blog\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang='ts' setup>
import { reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { IMenusType } from '../../types'
const menus = reactive<Array<IMenusType>>([
    { id: 1, title: '文章管理', herf: '/blog/article' },
    { id: 2, title: '分类管理', herf: '/blog/category' },
    { id: 3, title: '退出登录', herf: '/home' }
])

const router = useRouter()
const dialog: any = inject('dialog')
const message: any = inject('message')
// 跳转
const handlePush = (url: string) => {
    if (url === '/home') {
        dialog.warning({
            title: '退出登录',
            content: '确定退出登录？',
            positiveText: '确定',
            negativeText: '取消',
            maskClosable: false,
            onMaskClick: () => { },
            onEsc: () => { },
            onPositiveClick: () => {
                router.push('/')
                message.success('退出成功')
            },
        })
    } else {
        router.push(url)
    }

}
</script>
<template>
    <div class="wrapper">
        <ul class="menu">
            <li v-for="item in menus" :key="item.id" @click="handlePush(item.herf)">
                {{item.title}}
            </li>
        </ul>
        <div class='content-wrapper'>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
.wrapper {
    width: 100%;
    display: flex;
    height: 100vh;
    overflow: hidden;
    .menu {
        width: 10%;
        height: 95%;
        padding: 30px 0;
        border-right: 2px solid #2e925d8c;
        border-radius: 2px;
        overflow: auto;

        li {
            font-size: 18px;
            list-style: none;
            text-align: center;
            padding: 15px 0;
            cursor: pointer;

            &:hover {
                background-color: #74C69B;
                color: #ffffff;

            }
        }
    }

    .content-wrapper {
        flex: 1;
        padding: 45px;
        padding-top: 24px;
        height: 100%;
        overflow: auto;
    }
}
</style>