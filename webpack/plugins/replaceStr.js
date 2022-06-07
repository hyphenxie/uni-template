class ReplaceStrPlugin {
    constructor (params) {
        this.pattern = params.pattern
        this.urlPrefix = params.urlPrefix
    }

    apply (compiler) {
        compiler.hooks.emit.tap('ReplaceStrPlugin', compilation => {
            // 遍历构建产物
            Object.keys(compilation.assets).forEach(item => {
                // .source()是获取构建产物的文本
                // .assets中包含构建产物的文件名
                if (/\.(acss|wcss|css)$/.test(item)) {
                    let content = compilation.assets[item].source()
                    if (typeof content === 'string') {
                        content = content.replace(this.pattern, this.urlPrefix)
                    }
                    // 更新构建产物对象
                    compilation.assets[item] = {
                        source: () => content,
                        size: () => content.length
                    }
                }
            })
        })
    }
}

module.exports = ReplaceStrPlugin
