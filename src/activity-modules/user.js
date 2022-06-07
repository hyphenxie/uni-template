export default {
    models: {
    },
    events: {
        // 更新用户信息
        async updateUserInfo ({
            $http,
            $getModel,
            $triggerEvent,
        }, info) {
            await $http.postUpdateUserInfo({
                nickName: info.nickName,
                headUrl: info.headImgUrl,
                userId: $getModel('indexData.user.userId'),
                _showLoading: false
            })
            await $triggerEvent('fetchIndexData')
        },
    }

}
