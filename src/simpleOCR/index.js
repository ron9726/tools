const exec = require('child_process').execSync
const path = require('path')
const fs = require('fs')
const { continueLoading } = require('../../shared-utils')
const { createWorker } = require('tesseract.js')
const sharp = require('sharp')
const execPath = path.resolve(__dirname, './crossLang')
const imagePath = execPath + '/clipboard_image.png'
const handledImagePath = execPath + '/clipboard_image_handled.png'
const cleanup = () => {
  if (fs.existsSync(handledImagePath)) {
    fs.rmSync(handledImagePath)
  }
  if (fs.existsSync(imagePath)) {
    fs.rmSync(imagePath)
  }
}
process.on('SIGINT', () => {
  cleanup()
  process.exit(0)
})

function getCmdStr() {
  switch (process.platform) {
    case 'win32':
      return 'python getClipboardImg.py'
    case 'darwin':
    case 'linux':
    default:
      return 'source ../python-venv/bin/activate && python3 getClipboardImg.py'
  }
}
module.exports = async function (loading) {
  const load = continueLoading(loading)
  const cmdStr = getCmdStr()
  const buf = exec(cmdStr, { cwd: execPath })
  load(buf.toString() || '')
  if (fs.existsSync(imagePath)) {
    sharp(imagePath)
      .greyscale() // 转为灰度图
      .normalize() // 自动调整对比度
      .linear(1.2, -30) // 增强对比度
      .sharpen({ sigma: 1 }) // 锐化
      .threshold(150) // 二值化
      .median(3) // 中值滤波去噪
      .toFile(handledImagePath)
    const worker = await createWorker(['eng', 'chi_sim'], 1, {
      logger(m) {
        if (m.status === 'recognizing text') {
          const dotNumber = (m.progress * 100).toFixed(2)
          load('', `${m.status} ${dotNumber}%`)
        } else {
          load('', `${m.status}   `)
        }
      },
      cachePath: path.resolve(__dirname, './traineddata'),
    })
    await worker.setParameters({
      tessedit_pageseg_mode: '6', // 单一文本块模式
    })
    const {
      data: { text },
    } = await worker.recognize(imagePath, { rotateAuto: true })
    setTimeout(() => {
      console.log((text || '').replace(/ /g, ''))
    }, 0)
    cleanup()
    await worker.terminate()
  }
}

module.exports.config = {
  alias: ['ocr'],
  args: {
    //no args
  },
  desc: '获取剪贴板中的图片, 并识别其中文字',
}
