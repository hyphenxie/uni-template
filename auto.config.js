const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
    // 页面配置
    pageList: [
        {
            pageName: 'entry',
            style: {
                navigationBarTitleText: '首页'
            },
            relativeDialog: ['FollowPrize', 'AwardResult']
        }
    ],

    // 弹窗相关配置
    DialogList: ['Test', 'FollowPrize', 'AwardResult', 'FollowGuide', 'DetentionGuide'],

    // 自动生成api列表配置
    baseURL: 'https://www.mdollar.cn/dollar-test-jiashi-chongfen/chongfen/', // 测试环境baseURL
    proBaseURL: 'https://www.qdollar.cn:6443/rush-top', // 生成环境baseURL
    swaggerURL: 'https://www.mdollar.cn/dollar-test-jiashi-chongfen/v2/api-docs', // swagger的api地址，F12打开swagger,找到docs的接口。
    apiListSrcPath: resolve(`./src/http/urls.js`), // 生成的接口路径,一般不该，为固定名称
    copySrcPath: resolve(`./src/http/copy.js`), // 生成url的备用存放地址,copy.js可随意命名
    whiteTags: ['嘉实宠粉小程序接口'], // 需要生成tag的白名单，具体为接口文档的某一列的值
}
