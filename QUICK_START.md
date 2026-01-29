# 快速开始指南

## 📦 项目结构说明

这是一个 **Monorepo** 项目，包含三个包：

1. **@link-link/shared** - 核心游戏逻辑（共享）
2. **@link-link/miniprogram** - 微信小程序版本
3. **@link-link/h5** - H5 网页版本（Vue3）

## 🚀 第一次使用

### 1. 安装依赖

```bash
pnpm install
```

这会安装所有包的依赖，包括：
- shared 包的构建工具
- 小程序的类型定义
- H5 的 Vue3 和 Vite

### 2. 构建共享包（可选）

```bash
cd packages/shared
pnpm build
```

> 注意：开发时不需要手动构建，pnpm workspace 会自动链接

## 🎮 运行项目

### 微信小程序

1. 打开微信开发者工具
2. 导入项目，选择 `packages/miniprogram` 目录
3. 确保 AppID 配置正确（或使用测试号）
4. 点击编译运行

### H5 版本

```bash
# 方式1：从根目录运行
pnpm dev:h5

# 方式2：进入 h5 目录运行
cd packages/h5
pnpm dev
```

然后在浏览器打开 `http://localhost:5173`

## 🔧 开发流程

### 修改核心逻辑

1. 编辑 `packages/shared/src/` 中的文件
2. 两个平台会自动使用最新的逻辑
3. 无需重新构建（开发模式下）

### 修改小程序 UI

1. 编辑 `packages/miniprogram/miniprogram/` 中的文件
2. 微信开发者工具会自动刷新

### 修改 H5 UI

1. 编辑 `packages/h5/src/` 中的文件
2. Vite 会自动热更新

## 📝 常用命令

### 根目录命令

```bash
# 安装所有依赖
pnpm install

# 运行 H5 开发服务器
pnpm dev:h5

# 构建 H5 生产版本
pnpm build:h5

# 清理所有 node_modules
pnpm -r exec rm -rf node_modules
```

### Shared 包命令

```bash
cd packages/shared

# 构建（生成 dist/）
pnpm build

# 监听模式构建
pnpm dev
```

### H5 包命令

```bash
cd packages/h5

# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🎯 游戏配置

### 修改难度

编辑 `packages/shared/src/constants.ts`:

```typescript
export const DIFFICULTY_CONFIGS = {
  easy: {
    rows: 6,        // 行数
    cols: 8,        // 列数
    iconTypes: 12,  // 图标种类
    timeLimit: 300, // 时间限制（秒）
  },
  // ...
}
```

### 修改棋子倍数

```typescript
// 每种图标生成多少对
export const MULTIPLE_NUMBER = 2  // 改成 3 会生成更多棋子
```

### 修改打乱次数

```typescript
// 棋盘生成时打乱的次数
export const DISRUPT_TIMES = 3
```

## 🐛 常见问题

### Q: 小程序报错找不到模块？

A: 确保在 `packages/miniprogram` 目录下运行了 `pnpm install`

### Q: H5 页面空白？

A: 检查浏览器控制台是否有错误，确保 `packages/shared` 包正常

### Q: 修改 shared 代码后没生效？

A: 开发模式下应该自动生效，如果不行：
1. 重启 H5 开发服务器
2. 重新编译小程序

### Q: pnpm install 很慢？

A: 可以配置国内镜像：
```bash
pnpm config set registry https://registry.npmmirror.com
```

## 📚 下一步

- 查看 [README.md](./README.md) 了解项目详情
- 查看 [DESIGN.md](./DESIGN.md) 了解设计文档
- 查看 [DEV_GUIDE.md](./DEV_GUIDE.md) 了解开发指南

## 🎨 自定义图标

目前使用彩色方块+数字作为临时图标。

要使用自定义图标：

1. 准备 30 个 PNG 图标
2. 小程序：放到 `packages/miniprogram/miniprogram/images/icons/`
3. H5：放到 `packages/h5/public/images/icons/`
4. 修改组件代码使用图片而不是彩色方块

## 🚢 部署

### H5 部署

```bash
cd packages/h5
pnpm build
```

将 `dist/` 目录部署到任何静态服务器（Nginx、Vercel、Netlify 等）

### 小程序发布

1. 在微信开发者工具中点击"上传"
2. 填写版本号和描述
3. 提交审核

## 💡 提示

- 两个平台共享同一套游戏逻辑，修改一处即可
- 开发时建议先在 H5 上测试，调试更方便
- 小程序需要真机测试某些功能（如触摸事件）
