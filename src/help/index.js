const { continueLoading, getFuncArgsStr } = require('../../shared-utils')

module.exports = function (loading) {
  const load = continueLoading(loading)
  load(
    '执行：tools <方法名称 | 方法别名> [-a [方法入参,空格分隔]], 使用 tools init 来自动注册方法'
  )
  load('列表：')
  const funcConfig = require('../../bin/funcConfigMapping.js')
  Object.keys(funcConfig).forEach((key) => {
    let config = funcConfig[key]
    let funcInfoStr = `-- 方法：${key}
       别名：${config.alias || '暂无'}
       描述：${config.desc || '暂无'}
       参数：${getFuncArgsStr(config.args, '\n        - ')}
    `
    load(funcInfoStr)
  })
}

module.exports.config = {
  alias: ['h'],
  desc: '列举使用方法，并列出所有方法信息',
}
