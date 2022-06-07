export default (dialogName) => {
    return {
        computed: {
            visible () {
                return this.$dialog.visible[dialogName]
            },
            openPayload () {
                return this.$dialog.openPayload[dialogName]
            },
            closePayload () {
                return this.$dialog.openPayload[dialogName]
            }
        },
        methods: {
            open () {
                return this.$dialog.open(dialogName)
            },
            close () {
                return this.$dialog.close(dialogName)
            }
        },
    }
}
