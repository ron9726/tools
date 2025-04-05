const exec = require('child_process').execSync
const fs = require('fs')
const { continueLoading } = require('../../shared-utils')

module.exports = function (loading, offset = 1) {
  const load = continueLoading(loading, '获取差异文件中...')
  const cmdStr = `git diff HEAD HEAD~${offset} --name-only`
  load(cmdStr)
  const buf = exec(cmdStr)
  const fileList = buf.toString().split('\n').slice(0, -1)
  if (fileList.length === 0) {
    load('执行完成，未发现差异文件')
  } else {
    fileList.forEach((file) => {
      load(`差异文件：${file}`)
    })
    load('复制文件到changedFiles文件夹中...', '')
    fs.mkdirSync('./changedFiles', { recursive: true })
    fileList.forEach((file) => {
      if (file.includes('/')) {
        const dirPath = file.slice(0, file.lastIndexOf('/'))
        fs.mkdirSync(`./changedFiles/${dirPath}`, { recursive: true })
      }
      fs.copyFileSync(`./${file}`, `./changedFiles/${file}`)
    })
  }
}

module.exports.config = {
  alias: ['diff-files', 'diff'],
  args: {
    offset: {
      desc: '距离最新提交的偏移量，默认1',
    },
  },
  desc: '获取HEAD~1的差异文件，并按照路径规整到changedFiles文件夹中',
}
