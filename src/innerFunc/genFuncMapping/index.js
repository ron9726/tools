const path = require('path')
const {
  continueLoading,
  getFuncModules,
  getFuncArgsStr,
} = require('../../../shared-utils')
const fs = require('fs')
module.exports = function (loading) {
  const load = continueLoading(loading, '')
  load('正在获取方法配置...')
  const funcModules = getFuncModules()
  const mapping = {}
  const funcConfigMapping = {}
  funcModules.forEach((fileName) => {
    if (fileName === 'innerFunc') {
      return
    }
    const func = require(`../../${fileName}`)
    mapping[fileName] = fileName
    func.config.alias?.forEach((a) => {
      mapping[a] = fileName
    })
    funcConfigMapping[fileName] = func.config
    load(`
方法: ${fileName}
别名: ${func.config.alias || '暂无'}
参数: ${getFuncArgsStr(func.config.args, '\n  - ')}`)
  })
  load()
  fs.writeFileSync(
    `${path.resolve(__dirname, '../../../bin/funcMapping.js')}`,
    `module.exports = ${JSON.stringify(mapping, null, 2)}`
  )
  fs.writeFileSync(
    `${path.resolve(__dirname, '../../../bin/funcConfigMapping.js')}`,
    `module.exports = ${JSON.stringify(funcConfigMapping, null, 2)}`
  )
}
