const path = require('path')
const fs = require('fs')
module.exports = {
  continueLoading(loading, curTxt) {
    let pre = curTxt
    return function (persistTxt, loadingTxt = pre) {
      if (persistTxt) {
        loading.stopAndPersist({ text: persistTxt })
      }
      pre = loadingTxt
      loading.start(loadingTxt)
    }
  },
  getFuncModules() {
    const funcModulesPath = path.resolve(__dirname, '../src/')
    const dirs = fs
      .readdirSync(funcModulesPath)
      .filter((dir) => dir !== 'index.js')
    return dirs || []
  },
  getFuncArgsStr(argDesObj, padding = '') {
    if (!argDesObj) {
      return '暂无'
    }
    let result = ''
    Object.keys(argDesObj).forEach((argName) => {
      result += `${padding}${argName} ${argDesObj[argName].desc || '暂无描述'}`
    })
    if (!result) {
      result = '暂无'
    }
    return result
  },
}
