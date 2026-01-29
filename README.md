# 连连看游戏 Monorepo

一个支持微信小程序和 H5 的连连看游戏项目，使用 pnpm workspace 管理多包。

## 项目结构

```
.
├── packages/
│   ├── shared/          # 共享核心逻辑包
│   │   ├── src/
│   │   │   ├── types.ts       # 类型定义
│   │   │   ├── constants.ts   # 常量配置
│   │   │   ├── game-logic.ts  # 游戏核心逻辑
│   │   │   └── index.ts       # 导出入口
│   │   └── package.json
│   │
│   ├── miniprogram/     # 微信小程序
│   │   ├── miniprogram/
│   │   │   ├── components/    # 组件
│   │   │   ├── pages/         # 页面
│   │   │   └── utils/         # 工具（引用 shared）
│   │   ├── project.config.json
│   │   └── package.json
│   │
│   └── h5/              # H5 版本 (Vue3 + Vite)
│       ├── src/
│       │   ├── components/    # Vue 组件
│       │   ├── App.vue
│       │   └── main.ts
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
│
├── pnpm-workspace.yaml  # workspace 配置
├── package.json         # 根配置
└── README.md
```

## 技术栈

### 共享包 (@link-link/shared)
- TypeScript
- 纯 JavaScript 逻辑，无框架依赖
- 包含：类型定义、常量、游戏核心算法

### 微信小程序 (@link-link/miniprogram)
- TypeScript
- SASS/SCSS
- 微信小程序原生框架
- Skyline 渲染引擎

### H5 版本 (@link-link/h5)
- Vue 3 (Composition API)
- TypeScript
- Vite
- 响应式设计

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发

#### 微信小程序
```bash
# 在微信开发者工具中打开 packages/miniprogram 目录
```

#### H5 版本
```bash
pnpm dev:h5
# 或
cd packages/h5
pnpm dev
```

### 3. 构建

#### H5 版本
```bash
pnpm build:h5
# 或
cd packages/h5
pnpm build
```

## 核心逻辑复用

所有游戏核心逻辑都在 `packages/shared` 中，包括：

- ✅ 棋盘生成算法
- ✅ 路径查找算法（直线、一转角、两转角）
- ✅ 消除逻辑
- ✅ 提示功能
- ✅ 重排功能
- ✅ 游戏状态检测
- ✅ 分数计算

两个平台只需实现各自的 UI 层，核心逻辑完全复用。

## 游戏功能

### 核心功能
- ✅ 棋盘生成（可配置行列数）
- ✅ 点击选择方块
- ✅ 路径查找和匹配判断
- ✅ 消除动画
- ✅ 计时功能
- ✅ 计分系统（基础分+连击加成）
- ✅ 游戏胜利/失败判定

### 辅助功能
- ✅ 提示功能（3次）
- ✅ 重排功能（3次）
- ✅ 暂停/继续
- ✅ 难度选择（简单/中等/困难）

### 界面功能
- ✅ 开始界面
- ✅ 游戏主界面
- ✅ 暂停界面
- ✅ 游戏结束界面

## 配置说明

### 常量配置 (packages/shared/src/constants.ts)

```typescript
// 棋子倍数
MULTIPLE_NUMBER = 2

// 打乱次数
DISRUPT_TIMES = 3

// 难度配置
DIFFICULTY_CONFIGS = {
  easy: { rows: 6, cols: 8, iconTypes: 12, timeLimit: 300 },
  medium: { rows: 8, cols: 10, iconTypes: 20, timeLimit: 480 },
  hard: { rows: 10, cols: 12, iconTypes: 30, timeLimit: 600 }
}
```

## 开发指南

### 添加新功能

1. **核心逻辑**：在 `packages/shared/src/game-logic.ts` 中添加
2. **小程序 UI**：在 `packages/miniprogram/miniprogram/components` 中实现
3. **H5 UI**：在 `packages/h5/src/components` 中实现

### 修改游戏规则

只需修改 `packages/shared` 中的代码，两个平台自动同步。

## 项目特点

1. **代码复用**：核心逻辑 100% 复用
2. **类型安全**：全项目 TypeScript
3. **Monorepo 管理**：pnpm workspace 统一管理
4. **独立开发**：各平台可独立开发和部署
5. **易于维护**：逻辑集中，修改一处生效全部

## License

MIT

## 作者

连连看游戏项目
