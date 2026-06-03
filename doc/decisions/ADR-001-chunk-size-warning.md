# ADR-001：Chunk Size Warning — 接受并提高阈值

**日期：** 2026-06-03
**状态：** 已采纳

## 背景

`npm run build` 时 Vite 报告 chunk 大小警告:

```
dist/assets/newtab.html-BZAluAhI.js  1,070.81 kB │ gzip: 293.93 kB
(!) Some chunks are larger than 500 kB after minification.
```

## 分析

体积构成（估算）:

| 依赖 | 大小 |
|------|------|
| three.js | ~600KB |
| react + react-dom | ~130KB |
| @react-three/fiber + drei | ~200KB |
| 项目代码 | ~10KB |
| 其他 | ~130KB |

Three.js 是体积大头。但这是硬需求——只有它提供了真实的 3D 透视渲染，CSS 2D 方案（如 my-forest-extension）无法满足"小猫沿路行走"的真实 Z 轴深度需求。

## 为什么不是问题

- Chrome 扩展新标签页 = 本地文件加载，不走网络
- gzip 后仅 294KB，本地磁盘读取毫秒级
- 新标签页打开时浏览器已缓存扩展文件

## 决策

**方案 B：提高 chunkSizeWarningLimit 至 1200KB。**

暂不做代码分割（方案 A），原因：
- 当前只有 1 个简单测试组件，做代码分割是过早优化
- 等所有场景组件开发完成后，再评估实际 bundle 大小决定是否分割
- 如果后续 bundle 膨胀超过影响首帧 500ms 目标，则采用方案 A

## 后果

- 构建警告消失
- 不改变实际体积
- 后续阶段需重新评估是否需要代码分割

## 参考

- Vite docs: [build.chunkSizeWarningLimit](https://vitejs.dev/config/build-options.html#build-chunksizewarninglimit)
- Rollup docs: [output.manualChunks](https://rollupjs.org/configuration-options/#output-manualchunks)
