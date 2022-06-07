const path = require('path')
const resolve = (dir) => {
    return path.join(__dirname, dir)
}
const ReplaceStrPlugin = require('./webpack/plugins/replaceStr')
const {
    isBuild,
    buildVersion,

    cdnBaseURL,
    cdnDirName,
    today,
    spriteSrcPath,
    spritePath,
    spriteCSSPath,
    spriteRefPath,

    globalInjectLess,
} = require('./base.config.js')
const SpritesCSS = require('./plugins/SpritesCSS')
module.exports = {
    chainWebpack: config => {
        // 打包生产的时候修改图片资源引用路径
        isBuild && config
            .module
            .rule('images')
            .test(/\.(jpg|png|gif)$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 10,
                publicPath: `${cdnBaseURL}/${cdnDirName}`,
                name: `${buildVersion}/[name].[ext]`,
            })
            .end()

        config.module.rule('eslint').use('eslint-loader').loader('eslint-loader').tap(opt => {
            opt.emitWarning = opt.emitError = opt.failOnWarning = opt.failOnError = false
            opt.fix = true
            return opt
        })

        config.resolve.alias
            .set('@components', resolve('src/components'))
            .set('@', resolve('src'))
        // 全局注入mixin.less
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => {
            config.module.rule('less').oneOf(type).use('style-resource')
                .loader('style-resources-loader')
                .options({
                    patterns: [
                        globalInjectLess,
                    ],
                })
        })
    },
    configureWebpack: (config) => {
        const plugins = []
        if (!isBuild) { // 只在开发环境打开雪碧图插件
            plugins.push(new SpritesCSS({
                src: spriteSrcPath,
                imgTarget: spritePath,
                cssTarget: spriteCSSPath,
                ref: spriteRefPath
            }))
        }
        plugins.push(new ReplaceStrPlugin({
            pattern: /https:\/\/cdn.dcloud.net.cn\/img\/shadow-(.*?).png/g,
            urlPrefix: ''
        }))
        config.plugins = [...config.plugins, ...plugins]
    },
    css: {
        loaderOptions: { // 向 CSS 相关的 loader 传递选项
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        before: function (app, server, compiler) {
            app.get('/some/path', function (req, res) {
                res.json({
                    custom: 'response'
                })
            })
        }
    }
}
