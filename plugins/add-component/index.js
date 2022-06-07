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
    isCamelCase
} = require('../utils/tools')

const createdComponent = async () => {
    const {componentName} = await inquirer.prompt([
        {
            type: 'input', // 问题类型
            name: 'componentName', // 数据属性名
            message: '请输入组件名', // 提示信息
            default: '', // 默认值
            validate: (e) => { return Boolean(e)}
        }
    ])
    if(!isCamelCase(componentName)) {
        errorLog('请输入符合CamelCase规范的组件名称')
        return createdComponent()
    }
    const dirExist = await fs.pathExists(`./src/components/${componentName}`)
    if (dirExist) {
        errorLog(`组件 ${componentName} 已存在`)
    } else {
        log('开始复制模板')
        await fs.ensureDir(`../../src/components/${componentName}/${componentName}.vue`)
        await fs.copy(resolve('./Template.vue'), resolve(`../../src/components/${componentName}/${componentName}.vue`))
        log('开始初始化文件')
        const Handlebars = require('Handlebars');
        const template = await fs.readFile(resolve(`../../src/components/${componentName}/${componentName}.vue`), 'utf8')
        const fileContent = Handlebars.compile(template, 'utf8')
        fs.outputFile(resolve(`../../src/components/${componentName}/${componentName}.vue`), fileContent({
            componentName
        }))
        successLog(`组件${componentName} done!`)
    }
}

createdComponent()

