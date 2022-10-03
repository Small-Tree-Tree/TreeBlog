<script lang='ts' setup>
import { reactive, ref, inject } from 'vue'
import request from '../utils/api'
import { adminStore } from '../store/index'
import { ILoginType, IRegisterType } from "../types"
import { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { loadFull } from "tsparticles";
import particlesOptions from "../utils/particles"
import { useRouter } from 'vue-router'
const store = adminStore()
const router = useRouter()
const tabValue = ref<string>('signin')
const message: any = inject('message')
// 绑定登录和注册的两个form表单
const formRef = ref<FormInst | null>(null)
const formRef2 = ref<FormInst | null>(null)
// 登录响应式数据
const loginInfo = reactive<ILoginType>({
    account: localStorage.getItem('account') || '',
    password: localStorage.getItem('password') || '',
    remember: localStorage.getItem('remember') === '1'
})

// 注册响应式数据
const registerInfo = reactive<IRegisterType>({
    account: '',
    password1: '',
    password2: ''
})

// 自定义登录规则
const loginRules: FormRules = {
    account: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                if (!value.trim()) {
                    return new Error('账号不能为空')
                }
            },
            trigger: ['input', 'blur']
        }
    ],
    password: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                if (!value.trim()) {
                    return new Error('密码不能为空')
                }
            },
            trigger: ['input', 'blur']
        }
    ]
}

// 自定义注册规则
const registerRules: FormRules = {
    account: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                if (!value.trim()) {
                    return new Error('账号名不能为空')
                } else if (value.length > 12 || value.length < 4) {
                    return new Error('账号长度为4-12字符之间')
                }
            },
            trigger: ['input', 'blur']
        }
    ],
    password1: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                if (!value.trim()) {
                    return new Error('密码不能为空')
                } else if (value.length > 18 || value.length < 8) {
                    return new Error('密码长度为8-18字符之间')
                }
            },
            trigger: ['input', 'blur']
        }
    ],
    password2: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                if (!value.trim()) {
                    return new Error('密码不能为空')
                } else if (value != registerInfo.password1) {
                    return new Error('两次输入的密码不同')
                }
            },
            trigger: ['input', 'blur']
        }
    ],

}

// 提交登录
const handleLogin = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            request.post('/admin/login', {
                account: loginInfo.account,
                password: loginInfo.password
            }).then((res) => {
                if (res.data.code == 200) {
                    // 登录成功后需要保存一些重要的信息
                    const { id, account, token } = res.data.data
                    store.saveInfo(id, account, token)
                    message.success('登陆成功！')
                    // 判断是否记住密码
                    if (loginInfo.remember) {
                        // 如果登陆成功并且remember为true则保存数据到本地
                        localStorage.setItem('account', (loginInfo.account) as string)
                        localStorage.setItem('password', (loginInfo.password) as string)
                        localStorage.setItem('remember', (loginInfo.remember) as boolean === true ? '1' : '0')
                    } else {
                        localStorage.setItem('account', '')
                        localStorage.setItem('password', '')
                        localStorage.setItem('remember', '0')
                    }
                    // 进行路由跳转
                    router.push('/blog')
                } else {
                    message.error('账号或密码错误，请重新登录！')
                    localStorage.setItem('account', '')
                    localStorage.setItem('password', '')
                    localStorage.setItem('remember', '0')
                }
            })
        } else {
            message.error('请重新输入')
        }
    })
}

// 提交注册
const handleRegister = ((e: MouseEvent)=>{
    e.preventDefault()
    formRef2.value?.validate((errors)=>{
        if(!errors){
            message.success('注册成功')
            // 清空数据
            registerInfo.account = ''
            registerInfo.password1 = ''
            registerInfo.password2 = ''
            // 切换登录
            tabValue.value = 'signin'
        }else{
            message.error('请检查填写信息')
        }
    })
})

const handleUpdateValue = (value:string)=>{
    tabValue.value = value
}

// 特效初始化
const particlesInit = async (engine: any) => {
    await loadFull(engine);
}
const particlesLoaded = async (container: any) => {
    console.log("Particles container loaded", container);
}

</script>

<template>
    <div>
        <Particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded"
            :options="particlesOptions" />
        <n-card hoverable>
            <div class="blogName">Tree 博客后台管理系统</div>
            <n-tabs class="card-tabs" size="large" animated style="margin: 0 -4px"
                pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                :value="tabValue"  @update:value="handleUpdateValue"
                >
                <!-- 登录 -->
                <n-tab-pane name="signin" tab="登录">
                    <n-form ref="formRef" :model="loginInfo" :rules="loginRules">
                        <n-form-item path="account" label="账号">
                            <n-input v-model:value="loginInfo.account" @keydown.enter.prevent placeholder="请输入账号" />
                        </n-form-item>
                        <n-form-item path="password" label="密码">
                            <n-input v-model:value="loginInfo.password" type="password" @keydown.enter.prevent
                                placeholder="请输入密码" />
                        </n-form-item>
                        <n-form-item path="submit">
                            <n-button ghost type="primary" class="loginButtom" @click="handleLogin">
                                登录
                            </n-button>
                        </n-form-item>
                        <n-checkbox v-model:checked="loginInfo.remember"> 记住我 </n-checkbox>
                    </n-form>
                </n-tab-pane>

                <!-- 注册 -->
                <n-tab-pane name="signup" tab="注册">
                    <n-form ref="formRef2" :model="registerInfo" :rules="registerRules">
                        <n-form-item-row path="account" label="账号">
                            <n-input placeholder="请输入用户名" v-model:value='registerInfo.account' />
                        </n-form-item-row>
                        <n-form-item-row label="密码" path="password1">
                            <n-input type="password" placeholder="请输入密码" v-model:value='registerInfo.password1' />
                        </n-form-item-row>
                        <n-form-item-row label="重新输入密码" path="password2">
                            <n-input type="password" placeholder="请重新输入密码" v-model:value='registerInfo.password2' />
                        </n-form-item-row>
                    </n-form>
                    <n-button ghost type="primary" class="loginButtom" @click="handleRegister">
                        注册
                    </n-button>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </div>
</template>

<style lang='less' scoped>
.n-card {
    width: 500px;
    padding-bottom: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
}

.blogName{
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    color: #18A058;
    font-family: '微软雅黑';
}

.loginButtom {
    width: 100%;
}

:deep(.n-form-item-label__text) {

    font-size: 16px;
    margin-bottom: 8px;
}
</style>