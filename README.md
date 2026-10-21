# Hexo + Butterfly 博客

- 线上地址：**https://yayo556788.github.io/**
- 源码仓库：https://github.com/yayo556788/yayo556788.github.io

基于 Hexo 8 + Butterfly 5 的个人博客，推送到 GitHub 后由 GitHub Actions 自动构建并发布到 GitHub Pages。

## 目录结构

```
blog/
├── _config.yml                 # 站点配置（标题、作者、url、root 等）
├── _config.butterfly.yml       # 主题配置（导航、社交、侧边栏、搜索等）
├── source/
│   ├── _posts/                 # 文章，一篇一个 .md
│   ├── _data/admin.json        # 后台写入的外观配置（头像 / Banner）
│   ├── admin/index.html        # 博客后台（纯静态 SPA，不经过 Hexo 渲染）
│   ├── about/index.md          # 关于页
│   ├── tags/index.md           # 标签页
│   └── categories/index.md     # 分类页
├── themes/butterfly/           # 主题（npm install 后自动生成，已被 git 忽略）
├── scripts/
│   ├── setup-theme.js          # 把 node_modules 里的主题同步到 themes/
│   └── admin-overrides.js      # 构建时把 admin.json 注入主题配置
└── .github/workflows/pages.yml # 自动部署流水线
```

## 本地使用

```bash
npm install          # 装依赖，并自动把 Butterfly 主题放到 themes/butterfly
npx hexo server      # 打开 http://localhost:4000 预览
npx hexo new "标题"  # 新建文章到 source/_posts/
npm run build        # 生成静态文件到 public/
npx hexo clean       # 清缓存（改了主题配置没生效时先用它）
```

> 主题不是 git 子模块，而是由 `package.json` 里的 `hexo-theme-butterfly` 版本锁定。
> 升级主题：改 `package.json` 里的版本号 → `npm install` → 重新 `hexo server`。

## 后台管理

地址：**https://yayo556788.github.io/admin/**

能做的事：

- **外观设置**：上传并替换头像、首页 Banner，可一键恢复默认
- **文章管理**：列表查看、写新文章、编辑已有文章、删除、导入本地 `.md` 文件
- 右上角显示最近一次构建状态，提交后约 1 分钟自动上线

### 首次登录

后台用 GitHub Token 认证，不依赖任何第三方服务：

1. 打开 [Fine-grained token 创建页](https://github.com/settings/personal-access-tokens/new)
2. **Repository access** → Only select repositories → 只勾 `yayo556788.github.io`
3. **Permissions** 设两项：`Contents` = Read and write，`Actions` = Read-only
4. 生成后把 `github_pat_…` 贴进后台登录框

勾选「记住此设备」会把 token 存在浏览器 localStorage（关掉浏览器仍有效），不勾则存在 sessionStorage（关闭标签页即失效）。**公共电脑上不要勾。**

### 安全模型（重要）

- token 只存在于你自己的浏览器，只在 `api.github.com` 之间传输，**不会**进入仓库、不会写进构建产物
- 后台页面本身是公开的（`/admin/` 谁都能打开），但没有 token 做不了任何操作
- 所以务必用**细粒度 token 且只授权这一个仓库**，用完可随时在 GitHub 上撤销
- 想更保险：给 token 设短的有效期（如 90 天），到期重新生成

### 生效与同步

- 后台的每次保存 = 往 `main` 分支提交一个 commit → 触发 Actions 重构 → 约 1 分钟生效
- **如果你本地也 clone 了仓库，后台改完记得先 `git pull` 再改本地**，否则推送会冲突
- 外观配置走 `source/_data/admin.json` + `scripts/admin-overrides.js` 注入，不直接改 `_config.butterfly.yml`，所以主题升级不会影响后台

> 换仓库部署时，除改 `_config.yml` 的 `url`/`root` 外，还要改 `source/admin/index.html` 顶部 `CFG` 里的 owner / repo / branch / siteUrl。


## 发布到 GitHub

> 本仓库已经完成下面全部步骤（仓库已建、Pages 已启用为 GitHub Actions、`origin` 已指向 SSH 地址），以下内容留作重建或换仓库时的参考。

### 1. 建仓库

- 想要 `https://<用户名>.github.io` 这个地址：仓库名必须是 **`<用户名>.github.io`**
- 想要 `https://<用户名>.github.io/blog` 这种子路径：仓库名随便取，例如 **`blog`**

工作流会自动判断仓库类型并写入正确的 `url` / `root`，两种方式都不用额外改配置。

### 2. 推送代码

```bash
git init
git add .
git commit -m "init: hexo blog with butterfly theme"
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

### 3. 开启 Pages

仓库 → **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**（不要选 Deploy from a branch）。

推完第一次后，Actions 里会出现 "构建并部署到 GitHub Pages"，跑完即可访问站点。

## 日常写作流程

```bash
npx hexo new "文章标题"   # 写
npx hexo server          # 本地看
git add . && git commit -m "post: 文章标题" && git push   # 推送后 1 分钟内自动上线
```

## 改成自己的信息

站点已按 `yayo556788` 配置完成（`url`、社交链接、侧边栏、关于页都已替换）。要改的话：

| 位置 | 改什么 |
| --- | --- |
| `_config.yml` | `title`（现为「Yayo 的博客」）/ `subtitle` / `author` |
| `_config.butterfly.yml` | `nav.logo`（导航栏图标）、`avatar.img`（头像）、`social`（社交链接） |
| `source/about/index.md` | 自我介绍、邮箱 |

头像和图标：把图片放进 `source/img/`，再写 `/img/文件名.png`（不要写相对路径，子路径部署会失效）。

## 常见问题

**页面能打开但样式全丢、控制台一堆 404**
项目页仓库（非 `<用户名>.github.io`）必须用子路径。本项目工作流已自动处理；若是手动 `hexo generate` 后自己上传，要保证 `_config.yml` 里 `root: /仓库名/`。

**构建时报 "Theme not found: butterfly"**
没执行 `npm install`（`postinstall` 才会把主题同步到 `themes/butterfly`）。执行一次 `npm install` 或 `npm run setup`。

**改了主题配置没生效**
`npx hexo clean && npx hexo server`，浏览器再强制刷新。

**想加评论**
`_config.butterfly.yml` 的 `comments.use` 支持 Giscus / Twikoo / Waline / Utterances，按官方文档填参数即可（推荐 Giscus，完全基于 GitHub Discussions，零后端）。

**想用 `hexo deploy` 手动发布**
`npm i hexo-deployer-git`，在 `_config.yml` 里配置：

```yaml
deploy:
  type: git
  repo: https://github.com/<用户名>/<仓库名>.git
  branch: gh-pages
```

并在 Settings → Pages 把 Source 改成 `gh-pages` 分支。
