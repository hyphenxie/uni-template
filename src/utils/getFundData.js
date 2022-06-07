import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
const _axios = axios.create({
    adapter: mpAdapter
})
const axiosGet = _axios.get
export default function getFundData ({
    company = 'dl',
    fundCode,
    incInfo,
    rateDimension
}) {
    const api = {
        // 交银
        // jy: `https://jy.cdollar.cn:6443/jiaoyinmini/miniapp/v1/fund/detail?fundCode=${fundCode}`, // 蚂蚁-生产
        // jy: `https://jy.cdollar.cn:8443/only_for_dongcai_test/component/v1/fund/detail?fundCode=${fundCode}`, // 东财-准生产
        jy: `https://jy.cdollar.cn:7443/jiaoyin-tiantian/component/v1/fund/detail?fundCode=${fundCode}`, // 东财-准生产
        // 道乐
        dl: `https://www.qdollar.cn/fund-center/fund/${fundCode}.fopcors`
    }[company]
    if (incInfo) {
        return dataHandler(incInfo, rateDimension, company)
    }
    return new Promise((resolve, reject) => {
        axiosGet(api)
            .then(res => {
                res = res.data
                const resData = res
                resolve(dataHandler(resData, rateDimension, company))
            }).catch((err) => {
                reject(err)
            })
    })
}
const utils = {
    getRateStr: (dimension, rate) => (dimension === 'qrnh' ? Math.abs(Number(rate)).toFixed(4) : Math.abs(Number(rate)).toFixed(2)) + '',
    codeToCN: {
        j1z: '近一周涨跌幅',
        j1y: '近一月涨跌幅',
        j3y: '近三月涨跌幅',
        j6y: '近6月涨跌幅',
        j1n: '近一年涨跌幅',
        j2n: '近两年涨跌幅',
        j3n: '近三年涨跌幅',
        j5n: '近五年涨跌幅',
        jnl: '今年以来涨跌幅',
        cll: '成立以来涨跌幅',
        zf: '日涨跌幅',
        qrnh: '七日年化涨跌幅'
    }
}
/**
 *
 * @param {Object} resData 接口返回的数据
 * @param {String} dimension 需要读取的数据时间维度
 * @param {String} company 接口所属基金公司，比如交银就有固定的数据接口
 */
function dataHandler (resData, dimension, company = 'dl') {
    switch (company) {
    case 'jy':
        return jyFundDataPipe(resData, dimension)

    default:
        return dlFundDataPipe(resData, dimension)
    }
}

/** 道乐数据中心接口数据处理方法 */
function dlFundDataPipe (resData, dimension) {
    const codeToCN = utils.codeToCN
    resData.jnyl = resData.jnl
    let rate = resData[dimension]
    if (rate === undefined) {
        rate = null
    }
    return {
        response: resData,
        ...resData, // 接口返回的数据
        dimensionCN: codeToCN[dimension],
        rate,
        rateStr: utils.getRateStr(dimension, rate), // 货币型保留四位小数，其它保留两位小数；这里返回的是涨跌幅的绝对值，是涨是跌看isEarning的值
        isEarning: rate >= 0, // 是否正涨跌幅
        earnings: rate >= 0, // 是否正涨跌幅
        rawInfo: Object.entries(codeToCN).reduce((arr, [key, keyName]) => {
            const incValue = resData[key]
            arr.push({
                key,
                keyName,
                incValue: incValue,
                rateStr: utils.getRateStr(key, incValue),
                incType: incValue < 0 ? -1 : incValue === 0 ? 0 : 1, // -1：负收益；0：收益为0；1：正收益
            })
            return arr
        }, [])
    }
}

/** 交银数据中心接口数据处理方法 */
function jyFundDataPipe (resData, dimension) {
    // resData = resData
    const rate = resData.fundDto[dimension] * 100
    console.log('rate', rate)
    let dimensionCN = ''
    for (let i = 0; i < resData.fund.length; i++) {
        const item = resData.fund[i]
        if (item.type === dimension) {
            dimensionCN = item.name
            break
        }
    }
    const rateStr = (dimension === 'qrnh' ? Math.abs(Number(rate)).toFixed(4) : Math.abs(Number(rate)).toFixed(2)) + ''
    const noData = isNaN(rateStr) || typeof resData.fundDto[dimension] === 'object'
    return {
        response: resData,
        ...resData.fundDto, // 接口返回的数据
        dimensionCN,
        rateStr: noData ? '--.--' : rateStr, // 货币型保留四位小数，其它保留两位小数；这里返回的是涨跌幅的绝对值，是涨是跌看isEarning的值
        isEarning: rate >= 0, // 是否正涨跌幅
        earnings: rate >= 0, // 是否正涨跌幅
        isNaN: noData
    }
}
// 用法示例
// loadFundData({
//     company: 'dl',
//     fundCode: profit.fundConfig.fundCode,
//     rateDimension: profit.fundConfig.rateDimension
// })
//     .then(fundData => {
//         console.log('fundData', fundData)
//         this.profitFundData = fundData
//     }).catch(err => {
//         console.error(err)
//     })

// 数据DTO
// {
//     "cll": 48.14, // 成立以来涨跌幅
//     "companyCode": null,
//     "companyName": null,
//     "createdTime": "2019-10-28 10:55:00",
//     "dtCll": null,
//     "dtJ1n": null,
//     "dtJ2n": null,
//     "dtJ3n": null,
//     "dtJ5n": null,
//     "fullNamePinyin": "JIAOYINHUOBIA",
//     "fundCode": "519588",
//     "fundName": "交银货币A",
//     "fundType": "货币型",
//     "j1n": 2.13,
//     "j1y": 0.18,
//     "j1z": 0.04,
//     "j2n": 5.51,
//     "j3n": 8.74,
//     "j3y": 0.54,
//     "j5n": 15.2,
//     "j6y": 1.02,
//     "jnl": 1.74,
//     "netDate": "10-25",
//     "netValue": 1,
//     "qrnh": 2.163,
//     "risk": null,
//     "shareScale": null,
//     "shortNamePinyin": "JYHBA",
//     "updatedTime": "2019-10-28 10:55:00",
//     "wfsy": 0.5898,
//     "zdhcl": null,
//     "zf": null,
//     "rateStr": "0.59",
//     "isEarning": true
// }
