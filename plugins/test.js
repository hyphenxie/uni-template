const os = require('os')
const path = require('path')
const fs = require('fs-extra')

const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()

function getPackJsonDir () {
    return path.join(process.cwd(), './.git')
}

function getGitConfig () {
    const _path = getPackJsonDir()
    if (fs.existsSync(_path)) {
        const config = fs.readFileSync(path.join(_path, 'config'), 'utf-8')
        const urlArr = config.match(/(?<=url = ).*?.git/g)
        const nameArr = config.match(/(?<=\[remote ").*?(?="\])/g)
        const gitArr = urlArr && urlArr.map((item, index) => {
            return {
                url: item,
                origin: nameArr[index],
                name: item
            }
        })
        console.log('gitArr', gitArr)
        return gitArr || []
    } else {
        return []
    }
}

const pushProjectToGit = async function () {
    const gitInfo = getGitConfig()
    console.log('gitInfo', gitInfo)
    if (gitInfo.length) {
        if (gitInfo.length > 1) {
            const answer = await prompt({
                type: 'list',
                message: '检测到多个关联git地址，请选择推送的git地址',
                name: 'url',
                choices: gitInfo,
            })
            console.log('answer', answer)
        } else {
            // pushGit(gitInfo[0])
        }
    } else {
        console.log('暂无关联的git地址,请先关联')
    }
}
