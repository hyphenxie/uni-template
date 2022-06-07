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
    pageList,
} = require('../../auto.config.js')

const pagePath = resolve('../../src/pages.json')

let pack = fs.readFileSync(pagePath)
pack = JSON.parse(pack)

pageList.forEach(async page => {
    const dirExist = await fs.pathExists(`./src/pages/${page.pageName}`)
    if (dirExist) {
        errorLog(`页面 ${page.pageName} 已存在`)
        // todo 讨论，页面存在时是否需要重新渲染弹窗
        fs.readFile(resolve(`../../src/pages/${page.pageName}/index.vue`), 'utf8').then(template => {
            const reg = /(<template[\s]*slot="dialog">)[\s\S]*?(<\/template>)/
            const replaceTemplate = template.replace(reg,
                `<template slot="dialog">
      ${renderDialogList(page.relativeDialog)}
    </template>`)
            fs.outputFile(resolve(`../../src/pages/${page.pageName}/index.vue`), replaceTemplate)
        })
    } else {
        log('开始复制模板')
        await fs.ensureDir(`../../src/pages/${page.pageName}`)
        await fs.copy(resolve('./template'), resolve(`../../src/pages/${page.pageName}`))
        log('开始初始化文件')
        const Handlebars = require('Handlebars')
        const template = await (await fs.readFile(resolve(`../../src/pages/${page.pageName}/index.vue`), 'utf8')).replace('privatePageName', page.pageName)
        const fileContent = Handlebars.compile(template, {
            noEscape: true
        })
        fs.outputFile(resolve(`../../src/pages/${page.pageName}/index.vue`), fileContent({
            dialogList: page.relativeDialog.map(dialog => {
                return {
                    dialogName: dialog
                }
            }),
        }))
        successLog(`页面${page.pageName} done!`)
    }

    const path = `pages/${page.pageName}/index`
    const pathObj = page.style ? {
        path,
        style: page.style
    } : {
        path
    }
    const index = findIndex('path', path, pack.pages)
    if (index >= 0) {
        pack.pages[index] = pathObj
    } else {
        pack.pages.push(pathObj)
    }
    fs.writeFileSync(pagePath, JSON.stringify(pack, null, 2))
})

const renderDialogList = (dialogList) => {
    return dialogList.reduce((str, dialog, index) => {
        return str +
      `<dialog-${dialog} />` + (index === dialogList.length - 1 ? '' : '\n      ')
    }, '')
}

const findIndex = (key, value, arr) => {
    let result = -1
    arr.some((item, index) => {
        if (item[key] === value) {
            result = index
        }
    })
    return result
}
