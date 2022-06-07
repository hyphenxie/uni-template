## version 0.1
+ new CHANGELOG.md。
+ new 生成apiList前询问是否覆盖。
+ fix 编译错误。

## version 0.2
+ new 自动生成组件、弹窗时命名CamelCase约束。
+ fix add-page，已存在的页面会自动引入配置的弹窗，其他代码不变。

## version 0.3
+ 2021-05-13
    + 分享方法实现防抖
    + 删除entry视图业务代码
    + 增加config文件夹
+ 2021-05-14
    + 接入MiniU,可取代小程序开发者工具，在chrome中调试(https://opendocs.alipay.com/mini/miniu/intro)
+ 2021-05-21
    + 编写USAGE.md
+ 2021-05-25
    + 修改打包生产时，上传提示语
+ 2021-05-27
    + add entry页面loading问题
+ 2021-05-31
    + 增加replacestr-plugin,解决unicdn引入的问题
+ 2021-06-05
    + 调整isCamelCase的判断方法
+ 2021-06-08
    + 删除APP.vue中onHide得无关代码，避免报错
    + update add-apiList方法，支持解析带{}的值，且避免post请求，路径后缀带get字符时的冲突
    + 兼容接口传参为数组的情况，参数为数组时，不使用公共参数。
+ 2021-06-18
    + fix H5打包问题（replaceStr插件问题）
    + fix yarn build时页面引用图片资源错误导致的空白（buildVersion的问题）
+ 2021-06-21
    + 增加cdnDirName不改时阻断图片上传进程
+ 2021-06-24
    + 接入H5授权（参照config/index.js里的授权配置）
+ 2021-09-08
    + 打包H5删除无关文件
+ 2021-09-29
    + 接入活动平台platformPlugin