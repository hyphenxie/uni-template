const fs = require('fs')
const path = require('path')
const moment = require('moment')
const getPkgVer = require('../utils/getPkgVer')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = function () {
    const uploadFile = require('../utils/uploadFile.js')

    const {
        cdnDirName,
        imageFile,
        spritePath,
    } = require('../../base.config.js')
    const buildVersion = getPkgVer(resolve('../../package.json'))
    if (typeof imageFile !== 'string') {
        imageFile.forEach(file => {
            fs.readdir(file, async (err, list) => {
                if (err) {
                    console.log(err)
                }
                const isImage = i => /\.(jpg|png|gif)$/.test(i)
                const fileList = [spritePath]
                for (const i of list) {
                    if (isImage(i)) {
                        console.log('i:', i)
                        fileList.push(`${file}/${i}`)
                    }
                }
                await uploadFile(fileList, `${cdnDirName}/${buildVersion}`)
                console.log('done!!!')
            })
        })
    } else {
        fs.readdir(imageFile, async (err, list) => {
            if (err) {
                console.log(err)
            }
            const isImage = i => /\.(jpg|png|gif)$/.test(i)
            const fileList = [spritePath]
            for (const i of list) {
                if (isImage(i)) {
                    console.log('i:', i)
                    fileList.push(`${imageFile}/${i}`)
                }
            }
            await uploadFile(fileList, `${cdnDirName}/${buildVersion}`)
            console.log('done!!!')
        })
    }
}
