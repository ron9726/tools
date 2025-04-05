#!/usr/bin/env node
const spinner = require('cli-spinners')
const ora = require('ora')
const chalk = require('chalk')
const { getFuncModules } = require('../shared-utils')
const fixedLoading = (text) => {
  return ora({
    text,
    spinner: spinner.dots,
  })
}
const yParser = require('yargs-parser')
const args = yParser(process.argv.slice(2), {
  alias: {
    'entry-point': 'e',
    'func-name': 'f',
    args: 'a',
  },
  array: ['args'],
})
// console.log(JSON.stringify(args,null,2))
let {
  entryPoint,
  funcName,
  _: [initOrFunc],
  args: funcArgs,
} = args
const loading = fixedLoading().start()
if (initOrFunc === 'init') {
  const genFuncMapping = require('../src/innerFunc/genFuncMapping')
  loading.start('发现方法中...')
  try {
    genFuncMapping(loading)
    loading.succeed('完成')
  } catch (error) {
    loading.fail('发现方法时出现了问题，失败')
    console.error(error)
  }
} else {
  if (!entryPoint) {
    entryPoint = process.cwd()
    const funcModules = getFuncModules()
    const exist = check(funcModules, funcName)
    funcArgs = funcArgs || []
    let funcMapping = {}
    try {
      funcMapping = require('../bin/funcMapping.js')
    } catch (error) {
      console.log(chalk.gray('请先执行tools init初始化系统'))
    }
    try {
      if (exist) {
        executeFunc(loading, funcName, funcArgs)
      } else if (initOrFunc && (funcName = funcMapping[initOrFunc])) {
        executeFunc(loading, funcName, funcArgs)
      } else {
        loading.fail(
          chalk.red(`执行失败：未找到${funcName || initOrFunc}对应的方法`)
        )
      }
    } catch (error) {
      loading.fail(chalk.red(`执行失败：\n ${error}`))
    }
  }
}

function check(funcList, func) {
  const find = funcList.find((f) => func === f)
  return !!find
}

function executeFunc(loading, funcName, funcArgs) {
  const targetFunc = require(`../src/${funcName}`)
  const res = targetFunc(loading, ...funcArgs)
  if (res instanceof Promise) {
    res.finally(() => {
      loading.succeed(chalk.green('执行完成'))
    })
  } else {
    loading.succeed(chalk.green('执行完成'))
  }
}
