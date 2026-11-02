# blog-legacy

Hexo 6.3.0 博客，使用 NexT 7.8.0 的 Pisces 布局。

## 初始化与运行

在项目根目录执行：

```powershell
git submodule update --init --recursive
npm ci
npm run server
```

默认预览地址为 `http://localhost:4000`，按 `Ctrl+C` 停止。

生成静态网站：

```powershell
npm run clean
npm run build
```

输出位于 `public` 目录。`node_modules`、`public` 和 `db.json` 不需要提交。

## 主题恢复记录

- `.gitmodules` 补回原先缺失的主题仓库映射。
- `themes/next` 固定在原仓库记录的提交
  `d24c48efb1ff1182b23926a3835e350f9c3ab6eb`，不要使用 `git submodule update --remote`
  随意升级这个历史版本。
- 主题自定义配置位于 `source/_data/next.yml`，无需修改子模块里的文件。
- Pisces 布局、深色模式、导航、头像、社交链接、代码复制与本地搜索，依据
  `gh-pages` 分支生成的页面恢复；不是原始主题配置文件的完整备份。
- 历史评论服务和访客统计未启用。启用前应确认服务、账号和相关配置仍可使用。
- 锁文件中的旧镜像下载地址已替换为 npm 官方地址，未改变依赖版本和校验值。

本次恢复在 Windows、Node.js 24.16.0、npm 11.17.0 下完成安装和构建验证。
旧依赖在该 Node.js 版本下会出现 `url.parse()` 弃用警告，但不阻止本次构建。
这次恢复没有执行依赖安全升级，也没有发布网站。

## 部署

`npm run deploy` 会按照 `_config.yml` 的 `deploy` 设置向远程仓库推送。
执行前请核对目标仓库、分支和 SSH 权限；本地预览不需要部署。