
const getAnswers = require('../utils/getAnswers')

const compressImages = require('./compressImages')
const uploadImages = require('./uploadImages')

const upgradePKG = require('../utils/upgradePKG')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const chalk = require('chalk')
const errorLog = error => console.log(chalk.red(`${error}`))

const {
    cdnDirName
} = require('../../base.config.js')

;(async () => {
    const { compress, upload } = await getAnswers([
        {
            type: 'confirm',
            name: 'compress',
            message: '是否开启图片压缩'
        },
        {
            type: 'confirm',
            name: 'upload',
            message: `是否上传图片（上传目录dollar/frontend/projects/${cdnDirName}）`
        },
    ])
    compress && await compressImages()
    // 直接从base.config.js取有问题，version取的不是update后的
    if (upload) {
        if (cdnDirName === 'dollar-project') return errorLog('请查看readme中的打包注意事项，并修改cdnDirName')
        await upgradePKG(resolve('../../package.json'))
    }
    upload && uploadImages()
})()
