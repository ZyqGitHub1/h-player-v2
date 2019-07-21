# h-player-v2

## 关于 h-player-v2

h-player-v2 是基于 Quasar Framework 开发应用程序，通过 electron 包装，实现对`色色资源站`，`玖玖资源站`，`撸死你资源站`，`富二代资源站`，`字幕网资源站`，`久草资源站`，`女优资源站`，`利来资源站`等资源采集站的分类浏览与在线播放。

## 功能特色

+ 集成八大资源采集站
+ 支持分类浏览与搜索
+ 特色多窗口播放模式
+ 支持http/https切换

## 预览🔞

<a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/screenshot-list.png">🔞 首页截图</a>

<a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/screenshot-video.png">🔞 播放页截图</a>

<a target="_blank" href ="https://raw.githubusercontent.com/ZyqGitHub1/h-player-v2/master/screenshot/screenshot-mini.png">🔞 多窗口播放截图</a>

## Get Started

```bash
# 安装依赖
yarn install
# 启动开发服务器
yarn electron:serve
# 编译二进制包
yarn electron:build
```

> ### Note
>
> 1. 资源采集网的配置信息位于src\store\module\site.js

### Customize Configuration

See [Configuration Reference](https://quasar.dev/quasar-cli/quasar-conf-js).

## Windows Release

对于 windows 用户提供了编译完成的应用，请到 [release](https://github.com/ZyqGitHub1/h-player-v2/releases) 页面下载最新版本

## 使用方法:

1. 到release下载最新版本的压缩包
2. 解压文件到任意目录
3. 运行解压目录下的h-player.exe文件

## TODO

- [x] 高亮当前分类
- [x] 页面缓存
- [x] 独立窗口播放
- [ ] 持久化配置文件
- [ ] 支持导入视频源
- [ ] http/https 功能优化
