# blog-legacy

Hexo 8.1.2 博客，使用 NexT 8.29.1 的 Pisces 布局。

## 仓库信息

- GitHub 用户名和作者：`old6ix`
- 联系邮箱：`old6ix@duck.com`
- 源码推送和 Hexo 部署地址：`gh-jiabh:old6ix/blog-legacy.git`
- 源码分支：`master`；静态页面部署分支：`gh-pages`

`gh-jiabh` 是本机 SSH 配置中的主机别名，其他机器需配置对应的 SSH 密钥和别名。
Git 提交身份属于本地配置，重新克隆后可在项目根目录执行：

```powershell
git config --local user.name old6ix
git config --local user.email old6ix@duck.com
```

## 初始化与运行

在项目根目录执行：

需要 Node.js >= 20.19.0，建议使用 Node.js 24 LTS。
项目通过 `packageManager` 固定 pnpm 12.16.1。尚未安装 pnpm 时可执行
`npm install -g pnpm@12.16.1`；后续项目操作统一使用 pnpm，不混用 npm 安装依赖。

```powershell
git submodule update --init --recursive
pnpm install --frozen-lockfile
pnpm run server
```

默认预览地址为 `http://localhost:4000`，按 `Ctrl+C` 停止。

生成静态网站：

```powershell
pnpm run clean
pnpm run build
```

输出位于 `public` 目录。`node_modules`、`public` 和 `db.json` 不需要提交。

## 主题与依赖升级记录

- 2026-11-03 将直接 npm 依赖升级到当日 registry 的最新稳定版本，并刷新兼容范围内的间接依赖。
- `.gitmodules` 已切换至 NexT 新维护仓库 `next-theme/hexo-theme-next`。
- `themes/next` 固定在 v8.29.1 的提交
  `ffb3f9bb07c88002a71424edc57c6cdbec6e34f0`，不要使用 `git submodule update --remote`
  随意改变固定版本。已有克隆切换本次版本时，先运行 `git submodule sync`，再运行初始化命令。
- 主题自定义配置已从 `source/_data/next.yml` 迁移至根目录 `_config.next.yml`，无需修改子模块里的文件。
- Pisces 布局、深色模式、导航、头像、社交链接、代码复制与本地搜索，依据
  `gh-pages` 分支生成的页面恢复；不是原始主题配置文件的完整备份。
- 历史评论服务和访客统计未启用。启用前应确认服务、账号和相关配置仍可使用。
- 依赖从 npm 官方 registry 下载；当前用 `pnpm install --frozen-lockfile` 安装经过验证的依赖组合。
- Hexo 8 使用 `syntax_highlighter: highlight.js`，保留原有代码行号配置。
- NexT 使用 Hexo 内置 Nunjucks 渲染器，不应额外安装 `hexo-renderer-nunjucks`，否则可能出现模板找不到的问题。
- 保留并升级了备用 Landscape 主题；当前启用的主题仍然是 NexT。

本次升级在 Windows、Node.js 24.16.0、npm 11.17.0 下完成 `npm ci` 和构建验证，未发布网站。

### pnpm 迁移

- 已从 npm 锁文件导入 `pnpm-lock.yaml` 并移除 `package-lock.json`，直接依赖版本保持不变。
- `pnpm-workspace.yaml` 使用 `nodeLinker: hoisted`，兼容 NexT 子模块直接读取 Hexo 间接依赖的方式。
- 仅允许 `hexo-util` 执行安装脚本，以生成代码高亮所需的别名文件；不启用所有依赖的安装脚本。
- 安装与回归检查已在 pnpm 12.16.1 下验证。日常添加依赖使用 `pnpm add`，并提交锁文件变更。

### 回归检查

```powershell
pnpm test
```

该命令清理并生成网站，再使用 Node.js 内置测试运行器检查页面完整性、主题配置、
本地链接和资源、文章永久链接、RSS、搜索数据、站点地图及域名验证文件。
发布前仍应运行 `pnpm run server`，人工检查桌面端／手机端布局、搜索交互和代码复制。

### 已知限制

- `2018/zen-of-python/` 中的 `/img/1/1.1.png` 在升级前就已缺失，仓库中没有原图。
  本次不修改文章或伪造图片，链接测试仅对此处保留明确例外。
- 依赖升级时的 `npm audit` 剩余 17 项受影响依赖记录（9 低危、8 中危；无高危和严重项），
  主要来自上游 `deepmerge` 和 `minimatch` 依赖链。未使用强制降级或不兼容的 overrides。
  迁移 pnpm 后使用 `pnpm audit` 重新核查，不能将历史统计理解为网站已消除所有安全风险。
- 上游仍会产生部分依赖安装弃用提示。NexT 8.29.1 的 `next_url` 使用旧 `url.parse()`，
  会触发 Node.js 的 DEP0169 弃用警告，但不阻止当前构建和预览。
  为保持内容仓库简单，不添加本地兼容补丁，也不屏蔽警告，等待主题上游修复后再升级。
- NexT 的浏览器端第三方资源采用主题维护的 CDN 版本及完整性校验值，未强行覆盖成可能不兼容的最新版。

## 部署

`pnpm run deploy` 会按照 `_config.yml` 的 `deploy` 设置向远程仓库推送。
执行前请核对目标仓库、分支和 SSH 权限；本地预览不需要部署。