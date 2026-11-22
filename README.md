# quanx-rules

用于维护个人 Quantumult X（QuanX）分流规则与重写资源。

## 规则文件

| 文件 | 用途 | 订阅链接 |
| --- | --- | --- |
| `rules/wechat-direct.list` | 微信连接及常见图片域名直连 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/wechat-direct.list) |
| `rules/dmit-us.list` | 指定 Apple / Siri / ChatGPT / OpenAI 域名走 DMIT 美国 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/dmit-us.list) |
| `rules/direct.list` | 直连 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/direct.list) |
| `rules/proxy.list` | 代理 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/proxy.list) |
| `rules/reject.list` | 拦截 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/reject.list) |

`wechat-direct.list` 包含 3 条直连规则，`dmit-us.list` 包含 16 条 DMIT 美国规则。其余三个文件仅包含注释和格式示例，添加规则后再启用对应订阅。

## 在 Quantumult X 中使用

先在 Quantumult X 中建立名为 `DMIT美国` 的策略组，并选中实际的 DMIT 美国节点。如果使用配置文件，可在现有 `[policy]` 区段中添加以下条目，**将占位文字替换为客户端中的完整节点名称**：

```ini
[policy]
static = DMIT美国, 你的DMIT美国节点完整名称
```

将以下条目加入现有配置的 `[filter_remote]` 区段；如果区段已存在，只追加 URL 行。将 DMIT 专用条目放在可能匹配相同域名的通用 Apple、国内直连等远程规则之前；如果本地规则也匹配这些域名，需要同时检查其优先级。

```ini
[filter_remote]
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/wechat-direct.list, tag=微信直连, force-policy=direct, enabled=true
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/dmit-us.list, tag=DMIT美国专用, force-policy=DMIT美国, enabled=true
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/direct.list, tag=个人直连, force-policy=direct, enabled=false
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/proxy.list, tag=个人代理, force-policy=proxy, enabled=false
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/reject.list, tag=个人拦截, force-policy=reject, enabled=false
```

微信直连和 DMIT 专用订阅已在示例中启用；其余模板添加实际规则后，再将对应条目的 `enabled=false` 改为 `enabled=true`，并在 Quantumult X 中更新该资源。

`force-policy` 会覆盖规则文件中的策略。若已有合适的策略组或希望直接绑定节点，可把 `DMIT美国` 替换为该策略组或节点的完整名称；通用代理条目的 `proxy` 也可替换为已有的策略组名称。名称必须与客户端配置一致。使用分流模式，并结合已有规则检查匹配结果。

[examples/filter_remote.conf](examples/filter_remote.conf) 保存了相同的配置片段，仅用于合并到现有配置。

## 微信直连规则

将 `wechat-direct.list` 的订阅条目加入现有 `[filter_remote]` 区段顶部，更新资源后重新建立连接。

该规则将 `weixin.qq.com`、`qpic.cn`、`qlogo.cn` 及其子域名指定为直连，覆盖 `c2c.cdn.weixin.qq.com`、`minorshort.weixin.qq.com` 等微信连接。域名规则避免这些连接因目标 IP 未命中 `geoip, cn, direct` 而落入 `final` 代理策略。

更新后重试发送图片，并在网络活动中确认对应域名命中 `DIRECT`。这里只配置指定域名；仅显示 IP 且没有关联域名的连接需要结合实际日志另行核对。

## DMIT 美国规则

保留提供的 16 条规则及其匹配范围，转换为 Quantumult X 原生语法：`DOMAIN` → `host`、`DOMAIN-SUFFIX` → `host-suffix`、`DOMAIN-KEYWORD` → `host-keyword`，策略统一为 `DMIT美国`。

其中 `host-keyword, siri` 会匹配任何包含 `siri` 的域名；`bag.itunes.apple.com` 已被 `itunes.apple.com` 的后缀规则覆盖，但保留原始条目便于核对。规则只指定流量策略，实际出口由客户端选中的节点决定。

## Google One 响应正文重写

[重写订阅](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rewrites/google-one.snippet) · [脚本源码](scripts/google-one-response.js) · [原始 Stash 覆写](https://stash-google-one-rules-e0abf1.longquail.chatgpt.site/google-one-stash.stoverride)

将以下 URL 行追加到现有 `[rewrite_remote]` 区段：

```ini
[rewrite_remote]
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rewrites/google-one.snippet, tag=Google One正文替换, update-interval=172800, opt-parser=false, enabled=true
```

在 QuanX 中更新该资源，开启重写和 MITM，并安装、完全信任本机 Quantumult X 的 CA 证书。iOS 的证书完全信任入口为「设置 → 通用 → 关于本机 → 证书信任设置」。资源中已声明 `hostname = one.google.com`；确认它出现在有效的 MITM 主机名列表中，然后重新打开相关页面。

一个响应脚本顺序执行以下两处替换：

| 原文 | 替换为 |
| --- | --- |
| `30tb.ai.pro.m` | `30tb.m` |
| `20tb.m.v2` | `20tb.m` |

匹配范围与原覆写一致：仅 `https://one.google.com/ai?…`，不含问号的 `/ai` 不匹配。脚本仅替换响应正文中的这两个字符串，未验证订阅价格、购买资格或账户权益。已完成离线逻辑验证；实际请求能否被解密和重写，需要在客户端确认。停用时关闭该重写资源。

[examples/rewrite_remote.conf](examples/rewrite_remote.conf) 提供相同的配置片段。

## 维护规则

每行一条，使用 Quantumult X 原生格式。以 `#` 开头的行为注释。

```ini
# 精确匹配域名
host, api.example.com, direct

# 匹配域名及其子域名
host-suffix, example.net, proxy

# 拦截指定域名
host, ads.example.org, reject

# 匹配 IPv4 网段
ip-cidr, 192.0.2.0/24, direct
```

1. 按用途编辑 `rules/` 下的文件，并用注释说明规则用途。
2. 检查重复或冲突的规则，提交并推送到 `main`。
3. 在 Quantumult X 中更新资源，通过请求日志确认实际命中的规则和策略。

本仓库公开发布，个人节点订阅、密码和证书应保留在本地配置中。

格式参考：[Quantumult X 官方配置示例](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf)。
