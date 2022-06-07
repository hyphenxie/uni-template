const inquirer = require('inquirer')
// index.js
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))

const {
    DialogList,
} = require('../../auto.config.js')

const {
    isCamelCase
} = require('../utils/tools')

DialogList.forEach(async DialogName => {
    const dirExist = await fs.pathExists(`./src/d-dialogs/${DialogName}.vue`)
    if(!isCamelCase(DialogName)) {
        errorLog('请输入符合CamelCase规范的弹窗名称')
        return
    }
    if (dirExist) {
        errorLog(`弹窗 ${DialogName} 已存在`)
    } else {
        log('开始复制模板')
        await fs.ensureFile(`../../src/d-dialogs/${DialogName}.vue`)
        await fs.copy(resolve('./DialogTemplate.vue'), resolve(`../../src/d-dialogs/${DialogName}.vue`))
        log('开始初始化弹窗')
        const Handlebars = require('Handlebars');
        const template = await fs.readFile(resolve(`../../src/d-dialogs/${DialogName}.vue`), 'utf8')
        const fileContent = Handlebars.compile(template, 'utf8')
        fs.outputFile(resolve(`../../src/d-dialogs/${DialogName}.vue`), fileContent({
            DialogName
        }))
        successLog(`弹窗${DialogName} done!`)
    }
})
