export default {
    // 断网
    onOffLine () {},
    // 弱网
    onSlow3g () {},
    onPageLoad (vm, { pageName, query }) {
        if (!vm.$global.pageQuery) {
            vm.$global.pageQuery = {}
        }
        vm.$global.pageQuery = Object.assign(vm.$global.pageQuery, query)
        vm.$global.pageQuery[pageName] = query
    },
    onPageShow () {},
    onPageHide () {},
}
