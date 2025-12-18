# 连连看游戏设计文档

## 游戏架构设计

### 数据结构

#### 1. 游戏配置 (GameConfig)
```typescript
interface GameConfig {
  rows: number;           // 行数
  cols: number;           // 列数
  iconTypes: number;      // 图标种类数
  timeLimit: number;      // 时间限制（秒）
  difficulty: 'easy' | 'medium' | 'hard';
}
```

#### 2. 方块数据 (Tile)
```typescript
interface Tile {
  id: string;            // 唯一标识
  row: number;           // 行位置
  col: number;           // 列位置
  iconType: number;      // 图标类型（0表示已消除）
  selected: boolean;     // 是否被选中
  matched: boolean;      // 是否已匹配
}
```

#### 3. 游戏状态 (GameState)
```typescript
interface GameState {
  board: Tile[][];       // 游戏棋盘
  score: number;         // 当前分数
  timeLeft: number;      // 剩余时间
  status: 'ready' | 'playing' | 'paused' | 'won' | 'lost';
  selectedTiles: Tile[]; // 当前选中的方块（最多2个）
  hints: number;         // 剩余提示次数
  shuffles: number;      // 剩余重排次数
  combo: number;         // 连击数
}
```

#### 4. 路径点 (PathPoint)
```typescript
interface PathPoint {
  row: number;
  col: number;
}

interface Path {
  points: PathPoint[];   // 路径点数组
  turns: number;         // 转角数
}
```

### 核心算法

#### 1. 棋盘生成算法
```
目标：生成一个保证可以完全消除的棋盘

步骤：
1. 计算总格子数 = rows × cols（必须是偶数）
2. 计算每种图标的数量 = 总格子数 / iconTypes（必须是偶数）
3. 创建图标数组，每种图标出现偶数次
4. 随机打乱数组
5. 按顺序填充到棋盘
6. 验证是否有可消除的对（如果没有则重新生成）
```

#### 2. 路径查找算法
```
目标：判断两个方块是否可以通过不超过2个转角的路径连接

类型：
- 直线连接（0个转角）
- 一个转角连接
- 两个转角连接

实现：
1. 检查直线连接：横向或纵向直接相连
2. 检查一个转角：尝试两个可能的转角点
3. 检查两个转角：从起点向四个方向延伸，再尝试连接到终点

条件：
- 路径上的所有格子（除起点和终点）必须为空
- 路径可以经过棋盘边界外的虚拟空格
```

#### 3. 提示算法
```
目标：找到一对可以消除的方块

步骤：
1. 遍历所有未消除的方块
2. 对每个方块，查找与其图标相同的其他方块
3. 使用路径查找算法判断是否可连接
4. 返回第一对可连接的方块
```

#### 4. 死锁检测算法
```
目标：判断当前棋盘是否还有可消除的对

步骤：
1. 调用提示算法
2. 如果找不到任何可消除的对，则为死锁状态
3. 触发重排或游戏失败
```

### 组件设计

#### 1. GameBoard 组件（游戏棋盘）
**职责**：
- 渲染整个游戏棋盘
- 管理所有 Tile 组件
- 处理游戏逻辑

**Props**：
```typescript
{
  config: GameConfig;
  onGameEnd: (won: boolean, score: number) => void;
}
```

**State**：
```typescript
{
  gameState: GameState;
  pathLine: PathPoint[] | null;  // 当前显示的连线路径
}
```

#### 2. GameTile 组件（游戏方块）
**职责**：
- 渲染单个方块
- 处理点击事件
- 显示选中/匹配状态

**Props**：
```typescript
{
  tile: Tile;
  onTap: (tile: Tile) => void;
  showPath: boolean;
}
```

#### 3. GameHeader 组件（游戏顶部信息栏）
**职责**：
- 显示分数、时间、连击数
- 提供暂停、提示、重排按钮

**Props**：
```typescript
{
  score: number;
  timeLeft: number;
  combo: number;
  hints: number;
  shuffles: number;
  onPause: () => void;
  onHint: () => void;
  onShuffle: () => void;
}
```

#### 4. GameDialog 组件（游戏对话框）
**职责**：
- 显示游戏开始、暂停、结束等对话框
- 提供相关操作按钮

**Props**：
```typescript
{
  type: 'start' | 'pause' | 'win' | 'lose';
  score?: number;
  onStart: () => void;
  onResume?: () => void;
  onRestart: () => void;
  onExit?: () => void;
}
```

### 页面结构

#### index 页面（游戏主页面）
```
├── navigation-bar（自定义导航栏）
├── game-header（游戏信息栏）
├── game-board（游戏棋盘）
└── game-dialog（游戏对话框）
```

### 工具函数模块

#### game-logic.ts
```typescript
// 棋盘生成
generateBoard(config: GameConfig): Tile[][]

// 路径查找
findPath(board: Tile[][], start: Tile, end: Tile): Path | null

// 检查是否可消除
canMatch(board: Tile[][], tile1: Tile, tile2: Tile): boolean

// 消除方块
removeTiles(board: Tile[][], tile1: Tile, tile2: Tile): Tile[][]

// 查找提示
findHint(board: Tile[][]): [Tile, Tile] | null

// 检查游戏是否结束
checkGameOver(board: Tile[][]): boolean

// 重排棋盘
shuffleBoard(board: Tile[][]): Tile[][]

// 计算分数
calculateScore(baseScore: number, combo: number, timeBonus: number): number
```

### 动画设计

1. **选中动画**：方块放大+边框高亮
2. **连线动画**：路径线条从起点到终点的绘制动画
3. **消除动画**：方块缩小+淡出
4. **连击动画**：分数跳动+特效
5. **提示动画**：方块闪烁
6. **重排动画**：所有方块随机移动后归位

### 性能优化

1. **使用 Skyline 渲染引擎**：提升渲染性能
2. **按需更新**：只更新变化的方块
3. **事件节流**：防止快速点击
4. **图片预加载**：提前加载所有图标资源
5. **合理使用 setData**：减少数据传输量

### 难度配置

```typescript
const DIFFICULTY_CONFIGS = {
  easy: {
    rows: 6,
    cols: 8,
    iconTypes: 12,
    timeLimit: 300,  // 5分钟
  },
  medium: {
    rows: 8,
    cols: 10,
    iconTypes: 20,
    timeLimit: 480,  // 8分钟
  },
  hard: {
    rows: 10,
    cols: 12,
    iconTypes: 30,
    timeLimit: 600,  // 10分钟
  }
}
```

## 开发优先级

### P0（核心功能）
1. 棋盘生成和渲染
2. 点击选择逻辑
3. 路径查找算法
4. 消除逻辑
5. 游戏胜负判定

### P1（基础功能）
1. 计时器
2. 计分系统
3. 基础动画
4. 游戏状态管理

### P2（辅助功能）
1. 提示功能
2. 重排功能
3. 暂停/继续
4. 难度选择

### P3（优化功能）
1. 音效
2. 数据持久化
3. 排行榜
4. 更多动画效果

