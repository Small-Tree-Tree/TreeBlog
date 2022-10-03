<!--
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-30 22:03:16
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-01 23:16:56
 * @FilePath: \TreeBlogServer\client\src\components\WangEdite.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang='ts' setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, inject } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
type InsertFnType = (url: string, alt: string, href: string) => void
const serverUrl = inject('serverUrl')
const editorRef = shallowRef()
const toolbarConfig = {}
const valueHtml = ref<string>('<p></p>')
const editorConfig = {
    placeholder: '请输入内容...', MENU_CONF: {
        'uploadImage': {}
    }
}
// 配置上传图片
editorConfig.MENU_CONF['uploadImage'] = {
    // 服务端的地址
    server: serverUrl + '/upload/filelist',
    base64LimitSize: 10 * 1024,

     // 自定义插入图片
     customInsert(res: any, insertFn: InsertFnType) { 
        // res是服务端返回的数据
        // 从 res 中找到 url alt href ，然后插入图片
        // insertFn(url, alt, href)
        let url = serverUrl + res.data.url
        let alt = ''
        let href = ''
        insertFn(url,alt,href)
    },
}

const mode = ref<string>('default')
const emit = defineEmits(['htmlInfo1','htmlInfo2'])
const props = defineProps(['htmlInfo'])

// 模拟 ajax 异步获取内容,实现双向绑定
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.htmlInfo
    }, 10)
})


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

// 触发自定义事件,将文本中的值传给父组件
const sendHtml = () => {
    emit('htmlInfo1', valueHtml.value)
    emit('htmlInfo2', valueHtml.value)
}
</script>
<template>
    <div>
        <div style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <Editor style="height: 450px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
                :mode="mode" @onCreated="handleCreated" @onBlur="sendHtml" />
        </div>
    </div>
</template>
<style lang='less' scoped>

</style>