
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const getAnswers = require('./utils/getAnswers')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))

const pkgPath = resolve('../package.json')

const moveFile = async () => {
    log('开始移动h5目录')
    await fs.ensureFile('../temp')
    fs.copy(resolve(`../dist/build/h5`), resolve('../temp'), {
        overwrite: true
    }).then(async () => {
        await fs.emptyDir(resolve('../dist'))
        await fs.rmdir(resolve('../dist'))
        await fs.rename(resolve('../temp'), resolve('../dist'))
        successLog('移动成功')
    }).catch(err => {
        errorLog('移动失败：' + err)
    })
}

log('开始检测d5配置')
let pkg = fs.readFileSync(pkgPath)
pkg = JSON.parse(pkg)
if (!pkg.namespaceId) {
    getAnswers([
        {
            name: 'namespaceId',
            message: '请输入d5命名空间',
            default: '3'
        },
    ]).then(({ namespaceId }) => {
        pkg = insertItemToObjAfterKey(pkg, { namespaceId }, 'name')
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
        moveFile()
    })
} else {
    moveFile()
}

const insertItemToObjAfterKey = (obj, item, key) => {
    const newObj = {}
    const [ikey, ivalue] = Object.entries(item)[0]
    Object.keys(obj).forEach(pkey => {
        if (pkey === key) {
            newObj[pkey] = obj[pkey]
            newObj[ikey] = ivalue
        } else {
            newObj[pkey] = obj[pkey]
        }
    })
    if (!newObj[ikey]) newObj[ikey] = ivalue
    return newObj
}
