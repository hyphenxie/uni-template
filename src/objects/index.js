import Award from './Award'
import Fund from './Fund'
import ShopAward from './ShopAward'
export default (dtoName, dto, options = {}) => {
    if (dtoName === 'award') {
        return new Award(dto, options)
    }
    if (dtoName === 'shopAward') {
        return new ShopAward(dto, options)
    }
    if (dtoName === 'fund') {
        return new Fund(dto, options)
    }
    return console.warn(`unknown dto ${dtoName}!`)
}
