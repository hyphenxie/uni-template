const SpritesmithPlugin = require('webpack-spritesmith')

module.exports = class SpritesCSS {
    constructor ({ src, imgTarget, cssTarget, ref }) {
        return new SpritesmithPlugin({
            src: {
                cwd: src,
                glob: '*.png'
            },
            target: {
                css: [
                    [
                        cssTarget,
                        { format: 'spriteTemplate' }
                    ]
                ],
                image: imgTarget,
            },
            apiOptions: {
                cssImageRef: ref,
            },
            spritesmithOptions: {
                algorithm: 'binary-tree',
                padding: 20
            },
            customTemplates: {
                spriteTemplate: (res) => {
                    // 上下左右多2upx试试解决安卓的问题
                    return res.sprites.map(item => {
                        const offset = 0
                        return `
                          .sprite-${item.name} {
                            width: ${item.width + offset}upx;
                            height: ${item.height + offset}upx;
                            display: inline-block;
                            background-image: url('${item.image}');
                            background-size: ${item.total_width}upx ${item.total_height}upx;
                            background-position: ${item.offset_x + (offset / 2)}upx ${item.offset_y + (offset / 2)}upx;
                            background-repeat: no-repeat;
                            box-sizing: border-box;
                            position: relative;
                            flex-shrink: 0;
                            flex-grow: 0;
                          }
                        `
                    }).join('\n')
                }
            }
        })
    }
}
