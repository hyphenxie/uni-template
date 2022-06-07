import Award from './Award'
export default class ShopAward extends Award {
    constructor (awardDTO, options = {}) {
        super(awardDTO, options)
        if (!options.userPoint) console.warn(`ShopAward need userPoint!`)
        this.canCash = (options.userPoint >= awardDTO.needGold) && (awardDTO.packetLeftNum > 0)

        const getBtnText = () => {
            if (awardDTO.packetLeftNum <= 0) return '已兑完'
            if (awardDTO.needGold > options.userPoint) return `元宝x${awardDTO.needGold}兑换`
            return `元宝x${awardDTO.needGold}兑换`
        }
        this.btnText = getBtnText()
    }
}
