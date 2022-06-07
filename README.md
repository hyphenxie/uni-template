# xxx项目

# 后台接口文档地址
[接口文档地址](待补充)

# 蓝湖地址
[蓝湖地址](待补充)

# 项目经理
xxx

# 可运行环境
+ [x] 支付宝小程序<br/>
+ [ ] 微信小程序<br/>
+ [ ] 微信h5<br/>
+ [ ] 支付宝h5<br/>
+ [ ] 中台<br/>
+ [ ] 特殊类型，补充

# 中台相关
[测试中台地址](待开发)<br/>
账号:xxxx<br>
密码:xxxx<br>

[git地址](暂无)


# 开发环境
+ [x] 测试环境<br/>
+ [x] 生产环境

# 构建打包方式
+ yarn 安装依赖
+ yarn serve 编译运行测试环境
+ yarn build 编译运行生产环境

# 环境切换方式及注意点
1. 在切生产的时候注意要在`src/http/request `的`options`将对应域名加到白名单`whiteList`中，防止出现测试提示弹窗：<br/>
`whiteList: ['xxxxx']`<br/>
2. 小程序上传包的大小目前限制为`2M`,上传时如果包过于大,如果时代码体积太大，考虑分包，如果是`src/styles/sprite/sprite.png`图片过大，考虑执行`beforeBuild`命令,或者手动在[压缩网站](https://tinypng.com/)压缩图片后进行替换
3. 打包生产时修改base.config.js中cdnDirName的配置，格式为客户名-项目名 如南方新基 --> nanfang-xinji

# TODO
+ [ ] 通用业务视图示例（包含模块、组件等、组件的书写格式及规范）
+ [ ] 微信H5通用方法注入（包含授权、分享）
+ [x] 活动平台sdk的注入（platform）
+ [x] 文档编写（时间节点（4月底）、编写载体(暂定md)、格式？、反馈途径）

# 业务技术待优化点
+ 图片上传压缩
+ add-dialog
    + 弹窗种类选择(?)
    + [x] 命名规则约束
+ add-component
    + [x] 命名规则约束
+ add-page
    + [x] template渲染的格式优化
    + 渲染pages.json执行顺序问题
    + 页面种选择类(?)
+ add-apiList
    + apiName格式命名
    + 解析返回参数到http/adapters.js
    + 前端先行的情况：是否可以做一个映射文件，前后端各定义自己的名称，通过该文件映射对应（?）
    + 同个接口改了命名怎么处理(?)
    + 存在调多个不同swagger接口时，如何处理(?)
    + 考虑接口名是可变的，如读取接口名为/${acticle}时，该情况的处理(?)
    + [x] 添加是否直接覆盖的询问
+ activity-models
    + 如vuex map写法引入
    + 修改手动注册的方式,可配置项自动引入
+ 目录结构(?)
+ 所有自动生成得代码，都不应暴力覆盖，目前只存在文件级别得询问，希望代码层面的询问
+ 弹窗同时出现时，有层级判断有限显示，弹窗队列，打开->关闭->打开next->关闭next->n个打开关闭操作
+ 配置化文件夹的构想,包括auto的配置和页面参数配置
+ 指令的收集
+ MiniU的集成
+ webpack
    + plugins
        + replaceStr: 考虑接入数组实现多选项配置项
+ 请求层(http)
    + 考虑各平台的各自的api调用
    + 重复请求的优化点，请求事件队列（cancelToken）
    + 拦截时兼容多套异常错误，且支持自定义传入
    + 对于特殊传参需求，如/{id}为解析成特定参数，:id解析为id=xxx。
+ 编译
    + [x] 当cdnDirName没修改时，除了阻断图片上传进程，需继续阻断build打包执行
    + [x] H5打包时需要将将除正式的引用文件其余全部删除（beforePublishD5）
    + 代码混淆(webpack-obfuscator)
+ 授权
    + 当启用授权模式时，如果网络加载过慢会出现一段时间的白屏，解决方案：1、APP.vue加全局的背景色；2：将initAuth写进首页的loading里，但是loading进程会比较久
    + gateWay希望能取cdn的值，目前暂时是用时间戳来大致保持唯一性。
+ utils
    + H5字体适配
    + 分享（包括微信和支付宝）
    + 订阅快速点击封装
    + 支付宝版本管理(https://opendocs.alipay.com/mini/api/ngwgfi)
+ plugins
    + platform: 优化写法

# 存在的bug
1. 不关闭弹窗直接返回上一页，页面禁止滚动。（暂解决，但需严格书写auto.config.js里的配置项）
2. 支付宝组件的快速点击问题会出现多次，如关注、分享等。（分享可通$global.showSharePanel实现防抖）
3. 沉浸式页面标题会和内容重叠，设置transparentTitle为auto时弹窗会滑动穿透，设置pageContainer的absTop时，会失效



# 项目技术负责人
前端：xxx<br/>
后端：xxx<br/>
测试：xxx<br/>

# 模板相关信息
[使用文档](usage.md)<br/>
[反馈地址](https://szltech.yuque.com/xzz276/te571b)

