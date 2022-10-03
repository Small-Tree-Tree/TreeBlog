<!--
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-30 22:03:17
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-02 23:01:22
 * @FilePath: \TreeBlogServer\client\src\views\Blog\article.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang='ts' setup>
import { ref, reactive, onMounted, inject } from 'vue'
import * as dayjs from 'dayjs'
import { FormInst } from 'naive-ui'
import request from '../../utils/api'
import { IArticleType, IBlogList } from '../../types'
import WangEdite from "../../components/WangEdite.vue"
const formRef = ref<FormInst | null>(null)
const formRef2 = ref<FormInst | null>(null)
const message: any = inject('message')
const tabVal = ref<string>('文章列表')
const loading = ref<boolean>(true)
let blogList = ref<IBlogList[]>([])
let pageInfo = reactive({
    totalPage: 1,
    count: 0,
    page: 1,
    pageSize: 1
})

const articleInfo = reactive<IArticleType>({
    title: '',
    categoryId: null,
    content: ''
})

const articleModify = reactive({
    title: '',
    categoryId: 0,
    content: '',
    id: 0
})

type IOptions = {
    label: string,
    value: number
}

const options = ref<IOptions[]>([])

// 规则
const rules = {
    title: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入文章标题'
    },
    categoryId: {
        required: true,
        type: 'number',
        trigger: ['blur', 'change'],
        message: '请选择文章分类'
    }
}

// 获取列表数据
const getCategoryList = async () => {
    let res = await request.get('/category/categorylist')
    if (res.data.code == 200) {
        let list = res.data.data
        options.value = list.map((item: any) => {
            return {
                label: item.category_name,
                value: item.id
            }
        })
    }
}

// 接收到子组件传来的数据
const receiveHtml = (data: string) => {
    articleInfo.content = data
}
const receiveHtml2 = (data: string) => {
    articleModify.content = data
}

// 提交
const handleSubmit = (flag: number) => {
    if (flag) {
        const { title, categoryId, content, id } = articleModify
        formRef2.value?.validate(async (errors) => {
            if (!errors && content != '' && content != "<p><br></p>") {
                let res = await request.put('/blog/_token/update', {
                    id,
                    title,
                    categoryId,
                    content
                })
                if (res.data.code = 200) {
                    message.success(res.data.msg)
                } else {
                    message.error(res.data.msg)
                }
                // 最后清空
                articleInfo.title = ''
                articleInfo.categoryId = null
                articleInfo.content = ''
                tabVal.value = '文章列表'
                getBlogList(1)
            } else {
                message.error('检查是否漏填')
            }
        })
    } else {
        const { title, categoryId, content } = articleInfo
        formRef.value?.validate(async (errors) => {
            if (!errors && content != '') {
                let res = await request.post('/blog/_token/add', {
                    title,
                    categoryId,
                    content
                })
                if (res.data.code = 200) {
                    message.success(res.data.msg)
                } else {
                    message.error(res.data.msg)
                }
                // 最后清空
                articleInfo.title = ''
                articleInfo.categoryId = null
                articleInfo.content = ''
                tabVal.value = '文章列表'
                getBlogList(1)
            } else {
                message.error('检查是否漏填')
            }
        })
    }
}

// 切换tab
const handleUpdateValue = (value: string) => {
    tabVal.value = value
}

// 获取文章列表
const getBlogList = async (page: number) => {
    loading.value = true
    let res = await request.get(`/blog/search?pageSize=${3}&page=${page}`)
    if (res.data.code == 200) {
        blogList.value = res.data.data.rows
        pageInfo.count = res.data.data.total
        pageInfo.pageSize = res.data.data.pageSize
        // 计算总页数
        pageInfo.totalPage = Math.floor(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
        loading.value = false
    } else {
        message.error(res.data.msg)
    }
}

// 分页事件
const handlePage = (currentPage: number) => {
    getBlogList(currentPage)
}

// 修改文章
const changeArticle = (info: IBlogList) => {
    articleModify.categoryId = info.category_id
    articleModify.title = info.title
    articleModify.content = info.content
    articleModify.id = info.id
    tabVal.value = '修改文章'
}

// 删除文章
const deleteArticle = async (id:number) =>{
    let res = await request.delete(`/blog/_token/delete?id=${id}`)
    if(res.data.code == 200){
        message.success(res.data.msg)
        getBlogList(1)
    }else{
        message.error(res.data.msg)
    }
}

// 挂载
onMounted(() => {
    getCategoryList()
    getBlogList(1)
})

</script>
<template>
    <div>
        <n-tabs type="line" :value="tabVal" animated @update:value="handleUpdateValue">
            <n-tab-pane name="文章列表" tab="文章列表">
                <n-card class="card" v-for="item in blogList" :key="item.id" @click="changeArticle(item)">
                    <n-spin v-if="loading" size="large" />
                    <template v-else>
                        <div class="title">{{item.title}}</div>
                        <p class="category">分类 : {{options.find((i) =>{
                            return item.category_id ===  i.value
                        })?.label}}</p>
                        <span class="author">作者 : Tree </span>
                        <span class="time">时间 : {{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
                        <n-button class="del" type="error" ghost @click.stop="deleteArticle(item.id)">删除文章</n-button>
                    </template>
                </n-card>
                <n-pagination v-model:page="pageInfo.page" :page-count="pageInfo.totalPage" @update:page="handlePage"
                    :style="{'margin':'30px 0 50px 0'}" />
            </n-tab-pane>

            <n-tab-pane name="添加文章" tab="添加文章">
                <n-form ref="formRef" :model="articleInfo" :rules="rules">
                    <n-space vertical>
                        <n-form-item path="title" label="文章标题">
                            <n-input v-model:value="articleInfo.title" @keydown.enter.prevent placeholder="请输入标题" />
                        </n-form-item>

                        <n-form-item path="categoryId" label="文章分类">
                            <n-select placeholder="请选择文章分类" :options="options" v-model:value="articleInfo.categoryId" />
                        </n-form-item>
                    </n-space>

                    <n-form-item>
                        <WangEdite @htmlInfo1="receiveHtml" :htmlInfo="articleInfo.content"></WangEdite>
                    </n-form-item>
                    <n-button @click="handleSubmit(0)">提交</n-button>
                </n-form>
            </n-tab-pane>

            <n-tab-pane name="修改文章" tab="修改文章">
                <n-form ref="formRef2" :model="articleModify" :rules="rules">
                    <n-space vertical>
                        <n-form-item path="title" label="文章标题">
                            <n-input v-model:value="articleModify.title" @keydown.enter.prevent placeholder="请输入标题" />
                        </n-form-item>

                        <n-form-item path="categoryId" label="文章分类">
                            <n-select placeholder="请选择文章分类" :options="options"
                                v-model:value="articleModify.categoryId" />
                        </n-form-item>
                    </n-space>

                    <n-form-item>
                        <WangEdite @htmlInfo2="receiveHtml2" :htmlInfo="articleModify.content"></WangEdite>
                    </n-form-item>
                    <n-button @click="handleSubmit(1)" :style="{'marginBottom':'40px'}">提交</n-button>
                </n-form>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<style lang='less' scoped>

.category{
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

.card {
    margin: 30px 0 15px 0;

    &:hover {
        transform: translateY(-2px);
        transition: all 0.5s;
        box-shadow: 6px 3px 10px rgba(85, 85, 85, 0.404);
    }
}

.del{
    float: right;
}
</style>