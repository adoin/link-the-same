// 游戏相关类型定义

/** 游戏难度 */
type GameDifficulty = 'easy' | 'medium' | 'hard'

/** 游戏状态 */
type GameStatus = 'ready' | 'playing' | 'paused' | 'won' | 'lost'

/** 游戏配置 */
interface GameConfig {
  rows: number          // 行数
  cols: number          // 列数
  iconTypes: number     // 图标种类数
  timeLimit: number     // 时间限制（秒）
  difficulty: GameDifficulty
}

/** 方块数据 */
interface Tile {
  id: string           // 唯一标识
  row: number          // 行位置
  col: number          // 列位置
  iconType: number     // 图标类型（0表示已消除）
  selected: boolean    // 是否被选中
  matched: boolean     // 是否已匹配
}

/** 游戏状态 */
interface GameState {
  board: Tile[][]      // 游戏棋盘
  score: number        // 当前分数
  timeLeft: number     // 剩余时间
  status: GameStatus   // 游戏状态
  selectedTiles: Tile[] // 当前选中的方块（最多2个）
  hints: number        // 剩余提示次数
  shuffles: number     // 剩余重排次数
  combo: number        // 连击数
}

/** 路径点 */
interface PathPoint {
  row: number
  col: number
}

/** 路径 */
interface Path {
  points: PathPoint[]  // 路径点数组
  turns: number        // 转角数
}

/** 游戏统计 */
interface GameStats {
  totalGames: number   // 总游戏次数
  wins: number         // 胜利次数
  highScore: number    // 最高分
  totalTime: number    // 总游戏时间（秒）
}

/** 难度配置映射 */
interface DifficultyConfigs {
  easy: GameConfig
  medium: GameConfig
  hard: GameConfig
}

