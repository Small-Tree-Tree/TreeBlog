<!--
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-10-02 23:55:35
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-03 16:13:30
 * @FilePath: \TreeBlogServer\client\src\views\home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ICategoryType, IBlogList } from '../types/index'
import { throttle } from 'lodash'
import request from '../utils/api';
import * as dayjs from 'dayjs'
const router = useRouter()
const categoryVal = ref<number | null>()
type optionsType = {
    label: string,
    value: number
}
const message: any = inject('message')

const keyword = ref<string>('')

// 分类
const options = ref<optionsType[]>([])

// 文章列表
const articleList = ref<IBlogList[]>([])

// 获取分类数据
const getCategoryList = async () => {
    let res = await request.get('/category/categorylist')
    if (res.data.code == 200) {
        let list: ICategoryType[] = res.data.data
        options.value = list.map((item) => {
            return {
                label: item.category_name,
                value: item.id
            }
        })
    } else {
        message.error(res.data.msg)
    }
}

// 获取blog数据
const getBlogList = async () => {
    let res = await request.get('/blog/search')
    if (res.data.code === 200) {
        articleList.value = res.data.data.rows
    } else {
        message.error(res.data.msg)
    }
    categoryVal.value = null
}

// 跳转后台管理
const skipManage = () => {
    router.push('/login')
}

// 跳转到详情页面
const skipDetail = (id: number) => {
    router.push(`/detail?id=${id}`)
}

// 选择分类事件
const selectCategory = async (id: number) => {
    let res = await request.get(`/blog/search?categoryId=${id}`)
    if (res.data.code == 200) {
        articleList.value = res.data.data.rows
    } else {
        message.error(res.data.msg)
    }
}

// 搜索
const handleKeyword = async () => {
    if (categoryVal.value) {
        let res = await request.get(`/blog/search?keyword=${keyword.value}&category_id=${categoryVal.value}`)
        if (res.data.code == 200) { 
            articleList.value = res.data.data.rows
        } else {
            message.error(res.data.msg)
        }

    } else {
        let res = await request.get(`/blog/search?keyword=${keyword.value}`)
        if (res.data.code == 200) {
            articleList.value = res.data.data.rows
        } else {
            message.error(res.data.msg)
        }
    }
}

// 滚动事件
const scrollEvent = () => {
    // 监听页面 滚动事件
    // 距顶部
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const box = document.querySelector('.topTitle')
    if (scrollTop > 60) {
        box?.classList.add('active')
    } else {
        box?.classList.remove('active')
    }
}

// 监听滚动
window.addEventListener('scroll', throttle(scrollEvent, 400));

onMounted(() => {
    getCategoryList()
    getBlogList()
})
</script>

<template>
    <div class="wrapper">
        <div class="topTitle">
            <span class="defaultTitle" @click="getBlogList">首页</span>
            <div class="category">
                <n-popselect v-model:value="categoryVal" :options="options" trigger="click"
                    @update:value="selectCategory" virtual-scroll scrollable>
                    <button class="defaultTitle">分类</button>
                </n-popselect>
                <span>{{options.find((item) =>{
                return categoryVal == item.value
                })?.label}}</span>
            </div>
            <span class="defaultTitle" @click="skipManage">进入后台管理</span>
        </div>

        <div class="line"></div>

        <div class="search">
            <n-input type="text" placeholder="请输入关键字 Enter结束" v-model:value='keyword' :style="{ width: '50%' }"
                @keyup.enter.native="handleKeyword"></n-input>
        </div>

        <div class="content">
            <n-card v-for="item in articleList" :key="item.id" @click="skipDetail(item.id)" class="card">
                <div class="title">{{item.title}}</div>
                <p class="categoryName">分类 : {{options.find((i) =>{
                return item.category_id === i.value
                })?.label}}</p>
                <span class="author">作者 : Tree </span>
                <span class="time">时间 : {{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </n-card>
        </div>

        <div class="footer">
            <span>------ 到底啦!!! ------</span>
        </div>
    </div>
</template>

<style scoped lang='less'>
.wrapper {
    height: 100vh;
    width: 80%;
    margin: 0 auto;
    padding: 40px;

    .line {
        height: 1px;
        width: 100%;
        margin-bottom: 30px;
        background-color: rgba(212, 212, 212, 0.575);
    }

    .topTitle {
        z-index: 1000;
        background-color: #fff;
        position: sticky;
        top: 0;
        padding-bottom: 5px;

        &.active {
            border-bottom: 1px solid rgba(212, 212, 212, 0.575);
        }
    }

    .defaultTitle {
        font-size: 20px;
        color: black;
        padding: 6px 10px;
        cursor: pointer;

        &:hover {
            color: white;
            background-color: #5BCDA7;
            border-radius: 4px;
        }
    }

    .category {
        display: inline-block;
        position: relative;
        width: 120px;

        span {
            position: absolute;
            bottom: 5px;
            color: #666;
            font-size: 10px;
            margin-left: 5px;
        }
    }

    button {
        outline: none;
        background-color: transparent;
        border: none;
    }

    .content {

        .card {
            margin-bottom: 30px;

            &:hover {
                transform: translateY(-2px);
                transition: all 0.5s;
                box-shadow: 6px 3px 10px rgba(85, 85, 85, 0.404);
            }
        }
    }

    .search {
        margin-bottom: 20px;
    }

    .categoryName {
        color: #666;
    }

    .title {
        font-weight: blod;
        font-size: 24px;
    }

    .time {
        margin-left: 40px;
    }

    .author {
        font-size: #999;
    }

    .footer {
        width: 100%;
        text-align: center;
        font-size: 15px;
        color: #999;
        line-height: 30px;
    }
}
</style>