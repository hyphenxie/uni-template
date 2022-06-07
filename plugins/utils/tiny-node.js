const chalk = require('chalk')
const log = console.log

module.exports = function (target) {
    log(chalk.green('开始压缩图片...'))
    log(chalk.gray('图片源：' + target))

    const tinify = require('tinify')
    tinify.key = 's7YvvF61GtCD07VjNZ4y0QkXsBXF1kjk'

    const source = tinify.fromFile(target)
    return source.toFile(target).then(res => {
        log(chalk.green('图片压缩成功'))
    })
}
