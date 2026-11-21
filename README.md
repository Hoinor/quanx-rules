# quanx-rules

用于维护个人 Quantumult X（QuanX）分流规则。

## 规则文件

| 文件 | 用途 | 订阅链接 |
| --- | --- | --- |
| `rules/dmit-us.list` | 指定 Apple / Siri / ChatGPT / OpenAI 域名走 DMIT 美国 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/dmit-us.list) |
| `rules/direct.list` | 直连 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/direct.list) |
| `rules/proxy.list` | 代理 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/proxy.list) |
| `rules/reject.list` | 拦截 | [Raw](https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/reject.list) |

`dmit-us.list` 已包含 16 条实际规则，其余三个文件仅包含注释和格式示例，添加规则后再启用对应订阅。

## 在 Quantumult X 中使用

先在 Quantumult X 中建立名为 `DMIT美国` 的策略组，并选中实际的 DMIT 美国节点。如果使用配置文件，可在现有 `[policy]` 区段中添加以下条目，**将占位文字替换为客户端中的完整节点名称**：

```ini
[policy]
static = DMIT美国, 你的DMIT美国节点完整名称
```

将以下条目加入现有配置的 `[filter_remote]` 区段；如果区段已存在，只追加 URL 行。将 DMIT 专用条目放在可能匹配相同域名的通用 Apple、国内直连等远程规则之前；如果本地规则也匹配这些域名，需要同时检查其优先级。

```ini
[filter_remote]
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/dmit-us.list, tag=DMIT美国专用, force-policy=DMIT美国, enabled=true
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/direct.list, tag=个人直连, force-policy=direct, enabled=false
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/proxy.list, tag=个人代理, force-policy=proxy, enabled=false
https://raw.githubusercontent.com/Hoinor/quanx-rules/main/rules/reject.list, tag=个人拦截, force-policy=reject, enabled=false
```

DMIT 专用订阅已在示例中启用；其余模板添加实际规则后，再将对应条目的 `enabled=false` 改为 `enabled=true`，并在 Quantumult X 中更新该资源。

`force-policy` 会覆盖规则文件中的策略。若已有合适的策略组或希望直接绑定节点，可把 `DMIT美国` 替换为该策略组或节点的完整名称；通用代理条目的 `proxy` 也可替换为已有的策略组名称。名称必须与客户端配置一致。使用分流模式，并结合已有规则检查匹配结果。

[examples/filter_remote.conf](examples/filter_remote.conf) 保存了相同的配置片段，仅用于合并到现有配置。

## DMIT 美国规则

保留提供的 16 条规则及其匹配范围，转换为 Quantumult X 原生语法：`DOMAIN` → `host`、`DOMAIN-SUFFIX` → `host-suffix`、`DOMAIN-KEYWORD` → `host-keyword`，策略统一为 `DMIT美国`。

其中 `host-keyword, siri` 会匹配任何包含 `siri` 的域名；`bag.itunes.apple.com` 已被 `itunes.apple.com` 的后缀规则覆盖，但保留原始条目便于核对。规则只指定流量策略，实际出口由客户端选中的节点决定。

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
