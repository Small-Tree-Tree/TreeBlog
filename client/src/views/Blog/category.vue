<!--
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-29 21:31:07
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-09-29 23:53:10
 * @FilePath: \TreeBlogServer\client\src\views\Blog\category.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang='ts' setup>
import request from '../../utils/api'
import { ICategoryType } from "../../types"
import { ref, onMounted, inject, reactive } from 'vue'
const message: any = inject('message')
const categoryList = ref<ICategoryType[]>()
const categoryModal = ref<boolean>(false)
const addModal = ref<boolean>(false)
const categoryAdd = ref<string>('')
// 获取列表数据
const getCategoryList = async () => {
    let res = await request.get('/category/categorylist')
    categoryList.value = res.data.data
}

// 存储需要更新的值
const updateCategory = reactive({
    id: 0,
    categoryName: ''
})


// 删除
const handleDel = async (id: number) => {
    let res = await request.delete(`/category/_token/delete?id=${id}`)
    const { code, msg } = res.data
    if (code === 200) {
        message.success(msg)
    } else if (code === 403) {
        message.info(msg)
    } else {
        message.error(msg)
    }
    // 重新获取列表
    getCategoryList()
}

// 点击修改
const clickModify = async (id: number, categoryName: string) => {
    categoryModal.value = !categoryModal.value
    updateCategory.id = id
    updateCategory.categoryName = categoryName
}
// 处理修改
const handleModify = async () => {
    let res = await request.put('/category/_token/update', { id: updateCategory.id, categoryName: updateCategory.categoryName })
    if (res.data.code == 200) {
        message.success('修改成功')
        getCategoryList()
    } else {
        message.error('修改失败')
    }
    categoryModal.value = !categoryModal.value
}


// 添加
const handleAdd = async () => {
    let res = await request.post('/category/_token/add', { categoryName: categoryAdd.value })
    if (res.data.code == 200) {
        message.success('添加成功')
        getCategoryList()
    } else {
        message.error(res.data.msg)
    }
    addModal.value = !addModal.value
    categoryAdd.value = ''
}

onMounted(() => {
    // 在组件已挂载就发请求获取分类列表数据
    getCategoryList()
})

</script>
<template>
    <div>
        <n-button type="info" :style="{'marginBottom':'20px'}" @click="addModal = !addModal">
            添加分类
        </n-button>
        <n-modal v-model:show="addModal" preset="dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <n-input placeholder="请输入分类名" v-model:value='categoryAdd' :style="{'marginTop':'10px'}"
                @keyup.enter.native="handleAdd"></n-input>
            <template #action>
                <n-button @click="handleAdd">添加</n-button>
                <n-button @click="addModal = !addModal">取消</n-button>
            </template>
        </n-modal>
        <n-table :bordered="true" :single-line="false" striped>
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in categoryList" :key="item.id">
                    <td>{{item.id}}</td>
                    <td>{{item.category_name}}</td>
                    <td>
                        <n-space>
                            <n-button @click="clickModify(item.id,item.category_name)">修改</n-button>
                            <n-popconfirm @positive-click="handleDel(item.id)" positive-text="确定删除" negative-text="取消">
                                <template #trigger>
                                    <n-button>删除</n-button>
                                </template>
                                你确定要删除 {{item.category_name}} 吗？
                            </n-popconfirm>
                        </n-space>
                    </td>
                </tr>
            </tbody>
            <!-- 模态框 -->
            <n-modal v-model:show="categoryModal" preset="dialog">
                <template #header>
                    <div>修改分类</div>
                </template>
                <n-input v-model:value="updateCategory.categoryName" placeholder="请输入分类名" :style="{'marginTop':'10px'}"
                    @keyup.enter.native="handleModify">
                </n-input>
                <template #action>
                    <n-button @click="handleModify">确定修改</n-button>
                </template>
            </n-modal>
        </n-table>
    </div>
</template>
<style lang='less' scoped>

</style>