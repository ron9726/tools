const exec = require('child_process').execSync
module.exports = function () {
  const platform = process.platform
  console.log('platform :>> ', platform)
  switch (platform) {
    case 'win32':
      installWin32Dep()
      break
    case 'darwin':
      installMacosDep()
      break
    case 'linux':
    default:
      installLinuxDep()
  }
}

function installWin32Dep() {
  const cmdStr = 'pip install pillow pywin32'
  execute(cmdStr)
}
function installMacosDep() {
  const cmdStr =
    'python3 -m venv ./python-venv && source ./python-venv/bin/activate && pip3 install pillow pyobjc'
  execute(cmdStr)
}
function installLinuxDep() {
  const cmdStr =
    'python3 -m venv ./python-venv && source ./python-venv/bin/activate && pip3 install pillow'

  execute(cmdStr)
}

function execute(cmdStr) {
  exec(cmdStr, { cwd: __dirname, stdio: 'inherit', shell: process.env.SHELL })
}
