# 慧眼建安 WiseEye-JA · 交互原型

龙岗区建筑工地 AI 智能监管平台（7000 路 AI 摄像头）移动端 H5 原型，基于 `新需求/` 设计文档（00 架构 / 01 后端 / 02 前端 / 04 评审改进项）独立构建，与 `小快灵` 原型互不影响。

> 纯静态多页面 H5，无构建步骤、无外部依赖。所有数据为脱敏演示数据。

## 角色与页面

登录页可切换三类身份（演示任意密码可登录）：

### 巡查员（insp）
| 文件 | 说明 |
|------|------|
| `insp-home.html` | 工作台：今日概览 / 待确认徽章 / 实时报警 |
| `insp-alarms.html` | 报警清单（待确认 / 已处理） |
| `insp-detail.html?id=` | 复核确认：AI标注图 / 改等级时限 / 确认违规·标记误报 / 证据链 / 拨打 |
| `insp-evidence.html?id=` | AI 证据链：前后30s视频 + 截图 + 时间戳 + 签章（P1-5） |
| `insp-me.html` | 我的：工作统计 / 各入口 |
| `insp-sites.html` | 我的工地：地图点位 / 在线状态 / 近7日趋势 |
| `insp-points.html` | 我的相机点位：在线汇总 + 列表 |
| `insp-interval.html` | 报警推送间隔（本地持久） |
| `insp-drafts.html` | 离线草稿箱：弱网暂存 + 幂等补传 |
| `insp-qa.html` | AI 法规问答（带条文出处） |

### 工地负责人（site）
| 文件 | 说明 |
|------|------|
| `site-home.html` | 安全状态（正常/预警/危险）+ 报警 + 设备在线 |
| `site-meeting.html` | 班前会：发起 → 签到二维码 → GPS≤50m → 记录 |
| `site-alarms.html` | 本工地报警 + 整改提交（拍照+说明）+ 误报申诉（P1-2） |
| `site-devices.html` | 工地摄像头：列表 / 在线 / 地图（离线2h通知，P1-4） |
| `site-tasks.html` | 整改任务清单：待整改 / 已整改 |

### 监管管理端（admin）
| 文件 | 说明 |
|------|------|
| `admin-overview.html` | 总览：数字卡 / 类型分布 / 29街道GIS红黄绿 / 高风险TOP5 |
| `admin-risk.html` | 风险预警：五维评分排行 / AI政策建议 |
| `admin-report.html` | 报表中心：日/周/月 + 街道维度导出 |
| `admin-config.html` | 运营参数配置中心：冷却/聚合/静音/SLA/GPS（P1-6） |
| `admin-sites.html` | 工地管理：筛选 / 列表 / 导入导出 |
| `admin-alarms.html` | 报警管理：筛选 / 催办 / 误报率 |
| `admin-sla.html` | 巡查管理 SLA：按时率 / 工作量排行 / 超时升级 |
| `admin-meeting.html` | 一会三卡：执行率 / 未召开 / 执行记录 |
| `admin-enterprise.html` | 企业风险档案：聚合企业风险 / 约谈预警 |
| `admin-system.html` | 系统管理：用户角色 / 分组 / 在线率 / 操作日志 |

> 监管端总览页提供「管理功能」入口区，进入上述各管理页。

## 落地的评审改进项
P0-1 报警冷却/聚合 · P1-1 误报闭环 · P1-2 工地申诉 · P1-5 AI证据链 · P1-6 运营参数配置中心。

## 运行
直接打开 `index.html`（按登录角色跳转），或起本地静态服务后访问 `wiseeye/login.html`。
