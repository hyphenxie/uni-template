const chalk = require('chalk')
const log = console.log
const info = (msg) => log(chalk.green(msg))
const error = (msg) => log(chalk.red(msg))

const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

/**
 *
 * @param {String} from 需要上传的文件路径，必须为绝对路径
 * @param {String} to 文件上传的文件夹名
 * @param {String} uploadURL 图片上传的接口请求URL
 */
module.exports = function (from, to, uploadURL = 'http://183.6.107.160:22889/aliyun-cdn/upload/uploadFile') {
    const getType = obj => {
        return Object.prototype.toString.call(obj).replace(/\[object|\]|\s/g, '').toLowerCase()
    }
    const isArray = value => getType(value) === 'array'
    const isString = value => getType(value) === 'string'
    const fileList = []
    const failList = [] // 上传失败的列表
    const successList = [] // 上传成功的列表
    if (isArray(from)) {
        fileList.push(...from)
    } else if (isString(from)) {
        fileList.push(from)
    } else {
        return error(`${from} is illegal！`)
    }
    info(`开始上传文件至CDN,文件总数为:${fileList.length}...`)
    const taskList = []
    const upload = (filePath) => {
        const file = fs.createReadStream(filePath) // 创建读取流
        const form = new FormData() // new formdata实例
        const projectId = to
        form.append('file', file) // 把文件加入到formdata实例中
        form.append('prefix', `dollar/frontend/projects/${projectId}`) // 把文件加入到formdata实例中
        form.append('autoName', 0) // 把文件加入到formdata实例中
        taskList.push(axios.post(uploadURL, form, {
            headers: form.getHeaders()
        }).then(({ data }) => {
            if (data.errCode !== 'e0000') {
                failList.push({
                    filePath,
                    errMessage: data
                })
            } else {
                successList.push(data.body)
            }
        }).catch((err) => {
            error(JSON.stringify(err))
        }))
    }

    fileList.forEach(upload)
    return Promise.all(taskList).then(res => {
        info(res)
        log('图片上传完成！')
        info(`成功数：${successList.length}`)
        info(JSON.stringify(successList, null, 2))
        if (failList.length > 0) {
            error(`失败${failList.length}`)
            log('错误详情：\r\n', JSON.stringify(failList, null, 2))
        }
    })
}
