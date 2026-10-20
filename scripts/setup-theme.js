/**
 * 把 npm 安装的主题同步到 themes/ 目录
 * ------------------------------------------------------------
 * Hexo 只会从 <项目>/themes/<主题名> 读取主题，不会自动去 node_modules 里找。
 * 所以这里在 npm install 之后（postinstall）把 hexo-theme-butterfly 复制到
 * themes/butterfly，这样：
 *   1. 主题版本由 package.json 锁定，升级只需要改版本号后重新 npm install
 *   2. themes/butterfly 不用提交进 git，仓库保持轻量
 *   3. GitHub Actions 上 npm ci 会自动执行本脚本，构建可复现
 *
 * 如果检测到版本没变就跳过复制，避免每次安装都重复拷贝 200+ 个文件。
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', 'hexo-theme-butterfly');
const dest = path.join(root, 'themes', 'butterfly');
const marker = path.join(dest, '.theme-version');

function main() {
  if (!fs.existsSync(src)) {
    console.warn('[setup-theme] 未找到 node_modules/hexo-theme-butterfly，跳过。');
    return;
  }

  const { version } = JSON.parse(fs.readFileSync(path.join(src, 'package.json'), 'utf8'));

  if (fs.existsSync(marker) && fs.readFileSync(marker, 'utf8').trim() === version) {
    console.log(`[setup-theme] themes/butterfly 已是 v${version}，跳过复制。`);
    return;
  }

  // 旧版本先清掉，避免残留文件导致样式错乱
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  fs.cpSync(src, dest, {
    recursive: true,
    // 主题自身的 node_modules 不需要复制，依赖都已提升到项目根目录
    filter: (from) => path.basename(from) !== 'node_modules'
  });

  fs.writeFileSync(marker, `${version}\n`);
  console.log(`[setup-theme] 已将 Butterfly v${version} 同步到 themes/butterfly`);
}

main();
