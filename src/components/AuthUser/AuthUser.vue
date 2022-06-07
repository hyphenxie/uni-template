<template>
	<button v-if="!userInfo || forced" class="auth_user" open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError" scope='userInfo'>
        <slot></slot>
	</button>
	<div v-else class="auth_user" @click="onDone(userInfo)">
        <slot></slot>
	</div>
</template>

<script>
export default {
    name: 'auth_user',
    // 数据相关
    props: {
        uid: {
            type: [String, Number],
            default () {
                return ''
            }
        },
        forced: {
            type: Boolean,
            default () {
                return false
            }
        },
    },
    data () {
        return {
            userInfo: null,
            count: 0,
            localUserCacheKey: '_userInfo_V8'
        }
    },
    computed: {
    },
    // 函数方法
    methods: {
        /** 授权成功回调 */
        onGetAuthorize (userInfo) {
            if (this.waiting) return
            if (this.count > 0) return
            this.count++
            setTimeout(() => {
                this.count = 0
            }, 2000)
            this.waiting = true
            my.getOpenUserInfo({
                fail: res => {
                    this.onAuthError()
                    setTimeout(() => {
                        this.waiting = false
                    }, 100)
                },
                success: res => {
                    userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
                    console.log('userInfo', userInfo)
                    if (userInfo.countryCode) {
                        userInfo = this.handleAlipayUserInfo(userInfo, this.uid)
                        this.saveToLocal(userInfo)
                        this.$emit('update', userInfo)
                        this.$emit('done', userInfo)
                        setTimeout(() => {
                            this.waiting = false
                        }, 100)
                    } else {
                        uni.showToast({
                            title: userInfo.msg
                        })
                        this.$emit('error', userInfo)
                        this.waiting = false
                    }
                }
            })
        },
        /** 缓存到本地 */
        saveToLocal (userInfo) {
            my.setStorageSync({
                key: this.localUserCacheKey,
                data: userInfo
            })
            this.userInfo = userInfo
        },
        /** 从本地获取 */
        getFromLocal () {
            const key = this.localUserCacheKey
            const res = my.getStorageSync({ key })
            return res.data
        },
        /** 授权失败回调 */
        onAuthError (e) {
            this.$emit('error', e)
        },
        /** 处理空昵称or空头像 */
        handleAlipayUserInfo (userInfo, userId) {
            userInfo.headImgUrl =
        userInfo.avatar ||
        'https://gw.alipayobjects.com/os/q/cms/images/jgp0x2iu/578f79e2-7d97-46f8-b5f0-17728d3b83bb_w70_h70.png'
            userInfo.avatar =
        userInfo.avatar ||
        'https://gw.alipayobjects.com/os/q/cms/images/jgp0x2iu/578f79e2-7d97-46f8-b5f0-17728d3b83bb_w70_h70.png'
            userInfo.nickName =
        userInfo.nickName ||
        (userId ? `用户${userId.substr(userId.length - 4, 4)}` : '匿名用户')
            return userInfo
        },
        onDone (userInfo) {
            if (this.waiting) return
            this.waiting = true
            setTimeout(() => {
                this.waiting = false
            }, 1000)
            this.$emit('done', userInfo)
        }
    },
    created () {
        this.userInfo = this.getFromLocal()
    }
}
</script>

<style scoped lang="less">
	.auth_user {
		position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 100;
        opacity: 0;
    }
</style>
