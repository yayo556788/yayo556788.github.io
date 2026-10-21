/**
 * 后台外观配置注入
 * ------------------------------------------------------------
 * 博客后台（/admin/）只维护一个文件：source/_data/admin.json
 * 这里在生成站点前把它读出来，覆盖主题的对应配置：
 *   avatar      -> _config.butterfly.yml 的 avatar.img
 *   banner      -> _config.butterfly.yml 的 index_img（首页 Banner）
 *
 * 这样做的好处：后台不用去改 YAML 文本（浏览器里做正则替换极易写坏），
 * 主题升级、配置重排都不会影响后台功能；想恢复默认，把 JSON 里对应值清空即可。
 */

const fs = require('fs');
const path = require('path');

hexo.extend.filter.register('before_generate', () => {
  const file = path.join(hexo.base_dir, 'source', '_data', 'admin.json');

  if (!fs.existsSync(file)) return;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8')) || {};
  } catch (err) {
    hexo.log.warn('[admin] source/_data/admin.json 解析失败，已忽略：%s', err.message);
    return;
  }

  const theme = hexo.theme.config;

  if (data.avatar) {
    theme.avatar = Object.assign({ effect: true }, theme.avatar, { img: data.avatar });
    hexo.log.info('[admin] 应用自定义头像: %s', data.avatar);
  }

  if (data.banner) {
    theme.index_img = data.banner;
    hexo.log.info('[admin] 应用自定义首页 Banner: %s', data.banner);
  }
});
