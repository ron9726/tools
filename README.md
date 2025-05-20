# 目录结构

```javascript
-bin
--funcConfigMapping.js // 方法配置文件，包含方法的别名配置和描述，init命令生成
--funcMapping.js // 方法别名到方法的映射文件，init命令生成
--index.js // 命令入口文件
-shared-utils// 公共方法
-src // 方法按照独立文件夹的形式存放在src文件夹下
--getDiffFile // diff方法
--help // help方法
--innerFunc // 目前只有init命令执行的方法存放在这里
```

# 使用
```bash
# 安装
npm install -g git+https://g.hz.netease.com/wb.zhengchangrong01/tools.git#master
```

```bash
# 安装后的初次使用，执行init方法来注册src文件夹下的方法
tools init
# 初始化完成后执行方法，注：方法名称默认是方法文件夹的名称
tools <方法名称 | 方法别名> [-a [方法入参，空格分隔]]
# 查看已注册方法信息
tools help
```

# 方法新增

在src文件夹下新建对应方法文件夹，初始化一个index.js负责暴露方法函数

> 注：文件夹的名称会成为方法的名称

```javascript
// index.js
const { continueLoading } = require('../../shared-utils')
/**
 * loading: ora的loading实例
 * ...args: 外部传入的参数（如果有），不一定要使用剩余参数
 */
module.exports = function (loading, ...args) {
  /**
   * load(persistTxt, loadingTxt), load方法第一个参数是你想持久化保留在控制台的文本，第二个参数是控制台默认显示的文本
   * 注：
   * 1. 当给定loadingTxt之后，load方法会记录这次的loadingTxt，如果后续没有给定loadingTxt，load函数默认使用记录的loadingTxt
   * 2. 给定persistTxt之后会在控制台留下一行persistTxt，并在下一行展示loadingTxt
   */
  const load = continueLoading(loading, '这里是loadingTxt的默认文本')
  // 方法逻辑
}

// 方法的配置对象
module.exports.config = {
  // 别名配置
  alias: ['alias1', 'alias2'],
  // 参数配置
  args: {
    argName: {
      desc: 'desc',
    }
  }
  // 描述
  desc: 'desc',
}
```
# 外部依赖
如果方法存在外部依赖，可以通过在方法的根目录创建depRequire.js文件，在这个文件中编写相应的依赖安装逻辑；depRequire.js中的逻辑会在npm包的postinstall阶段执行
> 具体可以参考**simpleOCR**方法，该方法的depRequire文件涉及到三个python依赖(pillow，pywin32，pyobjc)
