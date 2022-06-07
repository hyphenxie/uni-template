const chalk = require('chalk')
const log = console.log

module.exports = function (from, to) {
    log(chalk.green('开始压缩图片...'))
    log(chalk.gray('图片源：' + from))

    const tinify = require('tinify')
    tinify.key = 's7YvvF61GtCD07VjNZ4y0QkXsBXF1kjk'

    const source = tinify.fromFile(from)
    return source.toFile(to).then(res => {
        log(chalk.green('图片压缩成功'))
        log('图片已经输出至：' + to)
    })
}
