const path = require('path')
const { getFuncModules } = require('./shared-utils/index')
const fs = require('fs')
const funcModules = getFuncModules()
const queue = []
console.log('process.env.SHELL :>> ', process.env.SHELL)
funcModules.forEach((fileName) => {
  const depR = path.resolve(__dirname, './src', fileName, './depRequire.js')
  if (fs.existsSync(depR)) {
    const func = require(depR)
    queue.push(func)
  }
})
function runQueue(queue) {
  async function step(index) {
    if (index >= queue.length) {
      return
    } else {
      await queue[index]()
      step(index + 1)
    }
  }
  step(0)
}

runQueue(queue)
