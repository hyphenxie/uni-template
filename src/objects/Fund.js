import Analytics from '@/utils/Analytics'
import {
    isNull,
    isUndefined
} from 'lodash'
import { oncePageHide } from '@/utils/route'
import urlHandler from '../utils/urlHandler'
export default class Fund {
    codeToCN = {
        j1z: '近一周涨跌幅',
        j1y: '近一月涨跌幅',
        j3y: '近三月涨跌幅',
        j6y: '近六月涨跌幅',
        j1n: '近一年涨跌幅',
        j2n: '近两年涨跌幅',
        j3n: '近三年涨跌幅',
        j5n: '近五年涨跌幅',
        jnl: '今年以来涨跌幅',
        cll: '成立以来涨跌幅',
        zf: '日涨跌幅',
        qrnh: '七日年化涨跌幅'
    }

    constructor (fundDTO) {
        if (fundDTO.incInfo) {
            fundDTO = {
                fund: fundDTO
            }
        }
        this.fundDTO = fundDTO
        for (const key in fundDTO) {
            this[key] = fundDTO[key]
        }
        try {
            // 涨跌幅数据
            this.rawInfo = JSON.parse(fundDTO.fund.incInfo || '{}')
            // 当前展示的涨跌幅
            const showRate = this.rawInfo[fundDTO.fund.fundInterval]
            this.showRate = (isNull(showRate) || isUndefined(showRate)) ? null : showRate
            // 当前展示的涨跌幅的中文文案
            this.showRateDimension = isNull(this.showRate) ? '--' : this.codeToCN[fundDTO.fund.fundInterval]
        } catch (error) {
            console.error(error)
        }
    }

    // 详情页跳转
    // @Analytics
    // 有一种异常的跳转场景，hide show hide 然后才进入目标页面
    // 正常：hide 进入 show
    // 异常1: hide show hide 进入
    // 异常2: hide show 未进入
    goFundDetail () {
        const fundCode = this.fundDTO.fund.fundCode
        oncePageHide(() => {
            Analytics.report('fund_detail', this.fundDTO.fund)
        })
        if (this.fundDTO.fund.fundLink) {
            return urlHandler(this.fundDTO.fund.fundLink)
        }
        return my.ap.navigateToFinance({
            type: 'fundDetail',
            fundCode
        })
    }

    // 购买页跳转
    goFundBuy () {
        const fundCode = this.fundVO.fund.fundCode
        return my.ap.navigateToFinance({
            type: 'fundBuy',
            fundCode
        })
    }
}
