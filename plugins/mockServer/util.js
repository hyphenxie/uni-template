const fs = require('fs')// 引入文件系统模块
const path = require('path')// 引入path模块

module.exports = {
    // 读取json文件
    getJsonFile: function (filePath) {
    // 读取指定json文件
        const fullPath = path.resolve(__dirname, filePath)
        const fileExist = fs.existsSync(fullPath)
        var json = fileExist
            ? fs.readFileSync(fullPath, 'utf-8')
            : fs.readFileSync(path.resolve(__dirname, './template.json'), 'utf-8')
        // 文件不存在则写入模板文件
        fs.writeFileSync(fullPath, json)
        return JSON.parse(json)
    },
    writeJsonFile: (apiName, data) => {
        fs.writeFile(path.resolve(__dirname, `./local-data/${apiName}.json`), JSON.stringify(data, null, 2), function (err) {
            if (err) {
                return console.error(err)
            }
            console.log('数据写入本地成功！')
            console.log('--------我是分割线-------------')
        })
    }
}
