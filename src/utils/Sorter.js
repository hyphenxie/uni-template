/**
 * 排序工具
 * options: []
 */
// Sorter([
//     ['broadType', 'broadStatus', 'positionId'],
//     [[1, 0], ['直播中', '预告', '回放'], 'negative'],
// ]))
export default class Sorter {
    /**
     * 对象排序工具
     * @param {Array{Array}} options
     * @param {Array{String}} options[0] 需要参与排序的key
     * @param {Array[Array ｜ String]} options[1] 需要参与排序的key对应的value权重值
     * @param {Array｜String} options1.item value权重列表，当为字符串时，只能是negative（根据值降序）或positive（根据值升序）
     */
    /**
     * 示例代码
        Sorter([
            ['broadType', 'broadStatus', 'positionId'],
            [[1, 0], ['直播中', '预告', '回放'], 'negative'],
        ]))
     */
    constructor (options) {
        const [keys, values] = options

        const list = []
        // 给每一种key-value组合计算一个权重
        keys.forEach((key, index) => {
            const value = values[index]
            if (typeof value === 'string') {
                list.push({
                    key,
                    level: list.length,
                    weight: Math.pow(10, -list.length),
                    type: value
                })
            } else {
                value.forEach(val => {
                    list.push({
                        key,
                        value: val,
                        level: list.length,
                        weight: Math.pow(10, -list.length)
                    })
                })
            }
        })
        // console.log('list:', list)
        return (a, b) => {
            let aWeight = 0
            let bWeight = 0
            for (const item of list) {
                const {
                    key,
                    value,
                    type,
                    weight
                } = item

                const aValue = a[key]
                const bValue = b[key]
                if (type === 'negative') {
                    if (aWeight === bWeight && aValue !== bValue) return aValue - bValue
                } else if (type === 'positive') {
                    if (aWeight === bWeight && aValue !== bValue) return bValue - aValue
                } else {
                    if (aValue === value) {
                        aWeight += weight
                    }
                    if (bValue === value) {
                        bWeight += weight
                    }
                }
            }
            return bWeight - aWeight
        }
    }
}
