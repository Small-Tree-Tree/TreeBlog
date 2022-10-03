/*
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-30 22:03:16
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-01 20:49:20
 * @FilePath: \TreeBlogServer\client\src\types\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface ILoginType {
    account: string | null
    password: string | null
    remember: boolean | null
}

export interface IRegisterType {
    account:string,
    password1:string,
    password2:string
}

export interface IMenusType {
    title:string,
    herf:string,
    id:number
}

export interface ICategoryType {
    id:number,
    category_name:string
}

export interface IArticleType {
    title:string,
    categoryId: number | null,
    content:string
}

export interface IBlogList {
    id:number,
    category_id:number,
    content:string,
    title:string,
    create_time:number
}