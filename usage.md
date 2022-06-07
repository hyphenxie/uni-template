
### <a href="#part1">一、项目运行</a>
### <a href="#part2">二、目录结构</a>
### <a href="#part3">三、全局API</a>
### <a href="#part4">四、其余目录结构说明</a>

## [一、项目运行](#part1)

> 首次运行之前需要安装依赖
```
yarn/npm i
```
> 启动服务
```
yarn serve
```
> 编译预览
+ 小程序
    + 使用对应的IDE打开 **dist** 目录下对应的编译后的文件
    + 使用MiniU(https://opendocs.alipay.com/mini/miniu/getting-started)
        ```
        1、npm i miniu -g
        2、修改mini.project.json中的miniprogramRoot为小程序文件目录
        3、miniu dev
        4、在浏览器调试
        ```
+ H5：直接使用浏览器调试
> 打包生产
```
yarn build
```
> 上传
+ 小程序：使用开发者工具的上传功能
+ H5: 发布到D5平台
  ```
  1、npm i -g git+ssh://git@47.103.79.80:npm/d5/d5-cli.git
  2、yarn publishd5
  ```
---

## [二、目录结构](#part2)
```
├─plugins                 // scripts脚本文件
│  ├─add-apiList
│  ├─add-component
│  ├─add-dialog
│  ├─add-page
│  │  └─template
│  ├─beforeBuild          // 打包生产时判断是否压缩图片及上传图片文件
│  ├─mockServer
│  │  ├─data
│  │  └─local-data
│  └─utils
└─src
    ├─activity-modules    // 接口调用链路及接口数据存储
    ├─components          // 通用组件
    ├─config              // 页面配置
    ├─d-dialogs           // 弹窗配置
    ├─http                // http网络配置
    ├─images              // 原图存储路径
    │  ├─common           // 通用图片路径
    │  ├─sprite           // 雪碧图素材文件存放路径
    ├─mixins              // mixins配置
    ├─objects             // class类配置
    ├─pages               // 页面配置
    ├─plugins             // Vue plugin配置
    ├─styles              // 样式存放路径 
    │  └─sprite           // 雪碧图输出路径
    └─utils               // 通用方法
```

## [三、全局API](#part3)
+ activity-modules
> 接口数据处理模块: 本模块是负责处理一次事件中需要的请求链路，及对请求数据进行处理和存储的功能
  + $triggerEvent(enevtName, params)
  + $updateModel(modelName, params)
  + $getModel(modelName)

  一个通用models.js解析
  ```javascript
  // 若同时包含models和events,导出如下，在index.js里的modules里注册
  export default {
      models: {
          computedModel (models) {
            return models.dataModel
          },
          dataModel: '' // any
      },
      events: {
          async doDraw (vm, parmas = {}) {
              const res = await vm.$http.postDraw(parmas)
              // edit code here
              return res
          },
      }
  }
  /*
   * 1.此时用this.$triggerEvent('draw.doDraw')调用事件 其中draw为在index.js中得modules里注册得模块名，$getModel一样如此,$getModel('draw.dataModel')
   * 2.models可为function类型和其他数据类型，function类型定义类似computed或vuex中得getters,function类型中得回调为全部定义的models值的集合。其他类型如data或state
   * 3.$triggerEvent的返回值为一个promise,回调参数为定义的return值
  */

  // 若只包含events,可直接导出,在index.js里的events里注册
  export default {
      async doDraw (vm, parmas = {}) {
          const res = await vm.$http.postDraw(parmas)
          // edit code here
          vm.$triggerEvent('fetchIndexData')
          vm.$triggerEvent('queryUserAwards')
          return res
      },
  }
  // 此时用this.$triggerEvent('doDraw')调用事件,$getModel类似
  ```
---
+ d-dialogs
> 弹窗模块
  + $dialog.open(dialogName, openPayload)
  + $dialog.close(dialogName, closePayload)
  > open方法返回一个promise，当下一次执行close时返回resolve状态并返回closePlaload
  ```javascript
    // page.vue
    this.$dialog.open('ActivityState', 'ENDED')
    // ActivityState.vue
    ...
    computed: {
      state () {
        return this.$dialog.openPayload['ActivityState'] // ENDED
      }
    }
    ...
  ```
  ```javascript
    // page.vue
    const info  = await this.$dialog.open('InfoCollectDialog')
    console.log(info) // 当执行submit之后，返回15300000000
    // InfoCollectDialog.vue
    ...
    methods: {
      submit () {
        this.$dialog.close('InfoCollectDialog', '15300000000')
      }
    }
    ...
  ```
  + $dialog.visible | Object  空值弹窗显示隐藏
  + $dialog.openPayload | any  open方法参数的接收值
  + $dialog.closePayload | any close方法参数的接收值

  + 修改弹入弹出动画
  ```html
  <DialogWrapper :zIndex="11" :visible="visible" contentIn="customInName" contentOut="customOutName">
        <view class="dialog-content"></view>
  </DialogWrapper>

  customInName: 弹入动画名
  customOutName： 弹出动画名
  动画的配置在@/components/DialogWrapper/style.less里配置
  可直接用yarn add-dialog自动生成基本的弹窗组件，但是需要先在auto.config.js进行正确的配置DialogList
  ```
---

+ http
> 接口定义模块：定义接口的模块，对axios的统一封装，且配置请求和响应的拦截
  + $http.apiName(params, onError)
    + apiName定义在url.js中，其中apiName的格式为methodsName => 如一个叫draw的post请求，定义为postDraw
    + 如果正常返回就使用res，如果异常返回就会走onError（err，next）,如果调用next就会返回,onError可以不定义，不定义走全局的错误处理，在request.js的exceptionHandler中定义
    + 如何判断是否正常返回呢？正常axios是看http请求返回状态码200正常，其它异常；实际看拦截器的最终实现
    + 默认的拦截器有哪些功能？1. loading；2. 参数占位符
    + params分三种形式：1. 正常key识别为接口入参；2. $开头的$key识别为axios的config；3. 下划线开头_key  识别为特殊功能，$loading
    + 没统一封装请求参数，请求参数的写法如axios一直，get请求需要包一层params: data
    + useMock暂未开放
    + 切生产时，whiteList需要配置生产环境的域名，用yarn build打包,否则会出现这是测试环境的弹框提示。
    + 注：可直接用yarn add-apiList自动生成url.js中的接口配置，但是需要先在auto.config.js进行正确的配置
---

+ platform
> 活动平台通用接口插件<br/>
<a href="https://szltech.yuque.com/dollar/vhs4kr/cgc5v3">接口文档</a>
  + 使用：$platform.xxxx(params)  xxx为platform插件中定义好的方法，params为传入参数
  + 接入方式
  1) 在platformConfig中配置
  ```javascript
      const platformA = {
          clinet: 'mp', // 环境,如果是小程序需要接入mp, 
          appId: '6a770d2aea734aad9641b968c60f83f2',  // 活动平台companyId
          activityId: 'DLd59542f10e1a4a1fac606838119ea6d1', // 活动平台activityId
          type: 'ALIPAY_USER_ID'  // 类型：ALIPAY_USER_ID/WECHAT/BROWSER_ID/MOBILE
      }   
      // 其他的平台配置类似，可配置多个活动平台
  ```
  2) 在main.js中引入
  ```javascript
      import PlatformPlugin from './plugins/vue-plugin-platform'
      import platformConfig from './config/platformConfig'
      Vue.use(PlatformPlugin, platformConfig)
  ```
  3) 注册key值:this.$platformA.setAuthKey(id) id为用户唯一标识符，常见userId或openId
  4) 引用其余方法即可

---

+ objects
>  统一模块类：可自行使用，文档待补充
  + $dto2vo(className, dto)<br/>
  最终核心表达是统一后端通用模块返回，将后端通用的模块处理成需要的结果，届时直接new className $dto2vo(className, dto)或即可。
---

 ## [四、其余目录结构说明](#part4)
+ components:<br/>
  通用组件目录，书写格式为components/组件名称/组件名称.vue,此时即可在页面中直接引用，不需安装、引用、注册三步。参照uni的easycom(https://uniapp.dcloud.io/collocation/pages?id=easycom)
+ images:<br/>
  静态资源存放目录，其中common存放通用图片，sprite存放生成精灵图的源文件。<br/>
  项目引入图片的方式：<br/>
  1、在common文件中的~images/common/图片文件名<br/>
  2、在sprite中的文件通过类名形式引进，引入类名为 .sprite-图片名。<br/>
  精灵图的生成规则为自动生成，借助webpack-spritesmith插件，自动生产的文件在styles/sprite中存放<br/>
  3、D5生成url访问。<br/>
  （所有图片，大于200k的最好都做压缩处理）

+ mixins: <br/>
  混入文件的存放目录

+ pages: <br/>
  页面存放目录<br/>
  注:可直接用yarn add-page自动生成url.js中的接口配置，但是需要先在auto.config.js进行正确的配置

+ plugins: <br/>
  VUE插件存放目录

+ styles: <br/>
  sprite:精灵图生成后的存放目录，页面引用图片时，引入sprite-less中定义的类名即可，但可能会有边角显示不全的地方，需要手动修改下/plugins/SpritesCss.js中的customTemplates配置，其余配置可参考文档<br/>
  其余less文件为一些通用的类，具体待补充

+ utils: <br/>
  通用方法类：具体包含的方法列表待补充

+ auto.config.js
  自动代码生成脚本的配置项，具体配置列表待补充
