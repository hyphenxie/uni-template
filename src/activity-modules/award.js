/** 奖品模块
 *
 */
import Award from '@/objects/Award'
export default {
    // 查询用户奖品
    async queryUserAwards ({
        $http,
        $getModel,
        $updateModel,
    }) {
        const list = await $http.getUserAward({
            params: { userId: $getModel('postUserIndex.user.userId') },
            _showLoading: false
        })
        const userAwards = list.map((item) => new Award(item))
        $updateModel('userAwards', userAwards)
        return userAwards
    },
}
