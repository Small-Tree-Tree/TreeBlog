<!--
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-10-03 14:55:58
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-03 15:46:28
 * @FilePath: \TreeBlogServer\client\src\views\detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted ,inject ,ref} from 'vue';
import { IBlogList } from '../types';
import * as dayjs from 'dayjs'
import request from '../utils/api';
const router = useRouter()
const route = useRoute()
const message:any = inject('message')
const { id } = route.query
const detailInfo = ref<IBlogList>()

const getDetail = async() =>{
    let res = await request.get(`/blog/detail?id=${id}`)
    if(res.data.code == 200){
        detailInfo.value = res.data.data[0]
    }else{
        message.error(res.data.msg)
    }
}

const skipHome = () =>{
    router.go(-1)
}

onMounted(() =>{
    getDetail()
})
</script>
    
<template>
    <div class="wrapper">
        <n-card>
            <div class="title" :style="{display:'inline-block'}">
                {{detailInfo?.title}}
            </div>
            <n-button @click="skipHome" :style="{'float':'right','marginTop':'12px'}">返回首页</n-button>
            <div class="info">
                <span>时间 : {{dayjs(detailInfo?.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
                <span>作者 : Tree</span>
            </div>
            <div class="contain" v-html="detailInfo?.content">
            </div>
        </n-card>
    </div>
</template>

<style scoped lang='less'>
.wrapper {
    width: 70%;
    margin: 0 auto;
    padding: 50px 10px;

    .title {
        font-size: 35px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
    }

    .info{
        margin-bottom: 15px;
        color: #666;
        span{
            margin-right: 30px;
        }
    }

    .contain{
        font-size: 18px;
        img{
            width: 100%;
        }
    }
}
</style>