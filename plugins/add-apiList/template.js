/**
 * api模板形式
 * // api说明（summary）
 * apiName: ${baseURL}/url
 * 
 * 优化点：getApiName方法的优化 
 * 解析规则: 是methods+方法名
 * 如：xxxxx/api/experience/v1/goldIndex => postGoldIndex
 * 会出现下列怪异情况
 * 1.xxxxx/api/experience/v1/getDate => postGetDate /getGetDate 期望只出现一次methods,接口名称带的methods会被替换或干掉（✔）
 * 2.xxxxx/api/experience/v1/article-hot => getArticle-hot 期望-变成驼峰形式(✔)
 * 3.xxxxx/api/experience/v1/{article} => get{articleID} 期望替代，并且转换实现方法(✔)
 * 4.xxx/api/experience/answer/test
 *   xxx/api/experience/task/test   => 两个后缀相同，但中间路径不同时，会出现两个同样得接口名
 * 
 */

// 生成apiName
 const getApiName = (data) => {
    let apiName = data.url.split('/').slice(-1)[0].replace(/[\{|\}]/g, '')
    const methods = ['get', 'post', 'put', 'delete']
    if (methods.find(item => apiName.toLowerCase().indexOf(item) === 0)) {
        if (apiName.toLowerCase().indexOf(data.methods) === 0) return apiName
        apiName = apiName.toLowerCase().replace(/get|post|put|delete/, '')
    }
    const especialSymbolReg = /[_|-]/ // 匹配特殊字符，避免特殊字符得影响
    apiName = apiName.split(especialSymbolReg).map(item=>item.replace(/[\s\S]/, function (g) { return g[0].toUpperCase() })).join('')
    return data.methods + apiName
}
// 渲染url模板
const templteRenderUrl = (data) => {
    return `
    // ${data.summary}
    ${getApiName(data)}` +': `${baseURL}' + data.url + '`,'
}

// todo 根据swagger返回值，渲染models
const templateRenderModel = (data, sourceData) => {
    
}

module.exports = {
    getApiName,
    templteRenderUrl,
    templateRenderModel,
}

