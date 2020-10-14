# 热更新工具配套的热更新DEMO

- [热更新插件使用文档](https://tidys.github.io/plugin-docs-oneself/docs/hot-update-tools/)
- [热更新参考游戏脚本逻辑(ts版本)](assets/hot-update/HotUpdate.ts) 

## 这里我简单剖析下DEMO:
- 项目中必须得导入一份manifest文件(`怎么导入参考插件使用文档`)。
- 游戏运行起来后，会运行项目的`HotUpdateScene`场景，这个场景会执行热更新逻辑，也就是`HotUpdate.ts`，我已经对热更逻辑进行了一个简单的封装，理论上其他项目可以直接使用。
- `HotUpdate.ts`的热更逻辑会根据当前项目的最新`manifest`文件信息，对比server上的`manifest`文件，有差异下载差异，没有差异就直接进入游戏了。
- 下载完差异后，游戏必须要软重启(`cc.game.restart()`)下，使热更新的资源生效，至此，热更新就算完成了。

## 热更后的游戏
本DEMO游戏热更后，版本为3.0，[点击预览](http://tidys.gitee.io/plugin-case-hot-update-res-server/web-mobile/)

我把热更资源放在了 [gitee仓库](https://gitee.com/tidys/plugin-case-hot-update-res-server) 的Pages上，
所以热更package url 是 `http://tidys.gitee.io/plugin-case-hot-update-res-server/`

## 热更测试包
我已经编译好了一个可运行的EXE游戏DEMO，并放到了Gitee，保证国内下载速度快

你可以在 [Gitee发行版本](https://gitee.com/tidys/plugin-case-hot-update-res-server/releases/1.0.0) 中手动下载自己想要测试的平台包，方便用来测试验证本DEMO的热更新功能。
- [win32.exe](https://files.gitee.com/group1/M00/10/CF/wKgCNF9Awp6ALnIPAhk1n2gTocE199.zip?token=203e5951353022467fbda42b083cff74&ts=1598080968&attname=win32.zip&disposition=attachment) ：直接下载解压后，即可使用 
  ![](doc/285ce852.png)
  ![](doc/win-use.gif)
  - windows的热更缓存位置`C:\Users\Administrator\AppData\Local\hot-update-tools\remote-asset`

- [android.apk]()：暂无





