/*
 * @Author: Small-Tree-Tree 913485079@qq.com
 * @Date: 2022-09-30 22:03:16
 * @LastEditors: Small-Tree-Tree 913485079@qq.com
 * @LastEditTime: 2022-10-01 20:56:41
 * @FilePath: \TreeBlogServer\client\src\vite-env.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-particles';
declare module 'tsparticles'
declare module 'dayjs'