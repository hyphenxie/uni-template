import { queryUrlParam } from '@/utils/tools'
import dayjs from 'dayjs'
export default class Award {
    constructor (awardVO) {
        awardVO = awardVO || {}
        for (const key in awardVO) {
            this[key] = awardVO[key]
            if (key === 'packetWorth') {
                this.awardWorth = awardVO[key]
            }
        }

        // 现金红包
        this.isCashPacket = awardVO.awardType === 'ALIPAY_CASH' || awardVO.awardType === 'CASH'
        // 消费红包
        this.isConsumPacket = awardVO.awardType === 'CONSUME_PACKET' || awardVO.awardType === 'CONSUME'
        // 财运金
        this.isVoucherPacket = awardVO.awardType === 'ALIPAY_VOUCHER' || awardVO.awardType === 'VOUCHER'
        this.isPacket = awardVO.awardType === 'PACKET' || this.isCashPacket || this.isConsumPacket || this.isVoucherPacket
        // 手卡
        this.isReviveCard = awardVO.awardType === 'CARD'
        // 元宝
        this.isGold = awardVO.awardType === 'GOLD'
        // 已过期
        this.expried = !awardVO.expireTime || dayjs().isAfter(awardVO.expireTime)
        this.toBeExpried = awardVO.expireTime && dayjs(awardVO.expireTime).diff(dayjs(), 'day') < 1
        // this.expried = true
        // 处理days字段
        this.daysText = dayjs(awardVO.dayjs, 'YYYYMMDD').format('YYYY-MM-DD')
        // 奖品点击
        this.handleClick = () => {
            if (this.isVoucherPacket) {
                const url = awardVO.url
                if (url) {
                    const partnerId = queryUrlParam('partnerId', url)
                    if (partnerId) {
                        my.openKBVoucherDetail({
                            partnerId: partnerId,
                            serialNumber: queryUrlParam('serialNumber', url)
                        })
                    } else {
                        my.openVoucherList()
                    }
                } else {
                    my.openVoucherList()
                }
            }
            if (this.isConsumPacket) {
                my.openVoucherList()
            }
        }

        // 奖品中文名（长）
        this.awardNameCNLong = {
            ALIPAY_CASH: '现金红包',
            CASH: '现金红包',
            CONSUME_PACKET: '消费红包',
            CONSUME: '消费红包',
            VOUCHER: '财运红包',
            ALIPAY_VOUCHER: '财运红包',
        }[awardVO.awardType || awardVO.packetType]

        // 奖品中文名（短）
        this.awardNameCN = {
            ALIPAY_CASH: '现金',
            CONSUME_PACKET: '消费',
            ALIPAY_VOUCHER: '财运',
        }[awardVO.awardType]

        // 奖品全称
        this.awardName = awardVO.awardName || `${awardVO.packetWorth || awardVO.awardWorth}元${this.awardNameCNLong}`
    }
}
