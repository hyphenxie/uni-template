const tinify = require('../utils/tiny-node')

module.exports = async function compressImages () {
    const {
        spritePath,
    } = require('../../base.config.js')
    console.log('图片压缩开始...')
    await tinify(spritePath)
    console.log('图片压缩完成...')
}
