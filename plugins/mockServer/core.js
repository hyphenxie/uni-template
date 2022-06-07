const Mock = require('mockjs')
const util = require('./util')
const express = require('express')
const app = express()
const port = 3033

;['get', 'post'].forEach(m => {
    app[m](/\/mock-middleware/, (req, res) => {
        const name = req._parsedUrl.pathname.split('/').pop()
        var json = util.getJsonFile(`../../src/http/mock-data/${name}.json`)
        const data = Mock.mock(json)
        res.json(data)
        util.writeJsonFile(name, data)
    })
})

app.listen(port, () => {
    console.log(`Mock server listening at http://localhost:${port}`)
})
