const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const getPkgVer = require('./plugins/utils/getPkgVer')
const moment = require('moment')
const today = moment().format('YYYYMMDD')
module.exports = {
    today,
    // 雪碧图相关
    isBuild: process.env.NODE_ENV === 'production',
    buildVersion: getPkgVer(resolve('./package.json')), // 打包版本，每次打包会自增
    cdnBaseURL: 'https://dlcdn.cdollar.cn/dollar/frontend/projects',
    cdnDirName: 'dollar-project', // 静态资源存放文件夹，完整路径是https://dollarcdn.cdollar.cn/dollar/frontend/projects/guojin_MGM
    imageFile: [
        resolve('./src/images'),
        resolve('./src/images/common')
    ], // 本地图片存放路径
    // 雪碧图配置
    spriteSrcPath: resolve('./src/images/sprite'), // 雪碧图图片素材存放路径
    spritePath: resolve('./src/styles/sprite/sprite.png'), // 雪碧图存放路径
    spriteCSSPath: resolve('./src/styles/sprite/sprite.less'), // 雪碧图CSS存放路径
    spriteRefPath: './sprite.png', // 雪碧图CSS的背景图引用路径
    globalInjectLess: resolve('./src/styles/global-inject.less'),
}
