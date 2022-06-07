class Analytics {
  publicData = {}

  constructor () {
      const publicData = this.publicData
      this.report = (eventName, data) => {
          console.log('统计：', eventName, Object.assign({}, publicData, data))
          //   my.reportAnalytics(eventName, Object.assign({}, publicData, data))
      }
  }

  updatePublicData (newData) {
      Object.assign(this.publicData, newData)
  }
}
export default new Analytics()
