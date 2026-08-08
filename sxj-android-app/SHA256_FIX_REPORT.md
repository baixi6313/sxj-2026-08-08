# 事现鉴 App · SHA-256 哈希链修复报告

## 问题
App 里每条「事现」的防伪指纹（`chainHash`）依赖一个纯 JS 的 SHA-256。
此前 `assets/www/js/sha256.js` 的**初始哈希常量 H0–H7 被写错**，导致
无论输入什么都算出同一个错误指纹（错误值 `dfc78710…` 而非标准的
`ba7816bf…`）。压缩循环和填充逻辑本身是对的——所以 bug 很隐蔽，
三套独立实现都复现了同一个错（因为它们共享了同一组错常量）。

## 修复
把初始向量改回 SHA-256 标准值：
```
0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
```

## 验证（对照 Node.js 官方 crypto，全部通过）
| 输入 | SHA-256 结果 | 结论 |
|---|---|---|
| 空串 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | PASS |
| `abc` | `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` | PASS |
| 53字节串 | `97b758bb56d31502530915e5a49ee34ea40e35c082d43f09d505fce13408db1c` | PASS |
| 中文「事现鉴共创论」 | `399c67f29cec4965ad0ce2d4237f85235a45f591e523c2c633f70c8931d794e4` | PASS |
| 1000字符 | `41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3` | PASS |

→ 事现指纹现在正确可独立复算，证明「该记录未被篡改」。

## 配套加固（让 App 能直接进应用商店）
- 补齐 `app/proguard-rules.pro`（release 构建原本引用却缺失）
- CI 显式安装 `platforms;android-34` + `build-tools;34.0.0`
- `app/build.gradle` 增加 release 签名配置（读环境变量里的 keystore）
- `.github/workflows/build.yml` 增加 `bundleRelease` 步骤 →
  配齐 4 个 secret 后，GitHub Actions 直接产出**商店可交的 release AAB**；
  debug APK 默认也会产出，供侧载测试。

## 当前状态
源码、`assets/www/*`、图标、CI、商店指南（`STORE_GUIDE.md`）均已就绪，
全工程引用文件齐全、无断链。**唯一无法在本环境完成的是「编译出包」**
（沙箱没有 Android SDK/JDK），需要你来决定出包方式（见对话提问）。
