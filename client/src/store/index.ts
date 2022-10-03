import {defineStore} from 'pinia'

export const adminStore = defineStore('adminStore',{
    state:()=>{
        return {
            id:'',
            token:'',
            account:''
        }
    },
    getters:{

    },
    actions:{
        saveInfo(id:string,account:string,token:string){
            this.id = id
            this.account = account
            this.token = token
        }
    }
})