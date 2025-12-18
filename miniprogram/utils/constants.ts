/**
 * 游戏常量配置
 */

/** 棋子倍数 - 控制最终生成多少份的棋子 */
export const MULTIPLE_NUMBER = 2

/** 重新排列次数 - 控制打乱棋盘的次数 */
export const DISRUPT_TIMES = 3

/** 难度配置 */
export const DIFFICULTY_CONFIGS: DifficultyConfigs = {
  easy: {
    rows: 6,
    cols: 8,
    iconTypes: 12,
    timeLimit: 300, // 5分钟
    difficulty: 'easy',
  },
  medium: {
    rows: 8,
    cols: 10,
    iconTypes: 20,
    timeLimit: 480, // 8分钟
    difficulty: 'medium',
  },
  hard: {
    rows: 10,
    cols: 12,
    iconTypes: 30,
    timeLimit: 600, // 10分钟
    difficulty: 'hard',
  },
}

/** 默认难度 */
export const DEFAULT_DIFFICULTY: GameDifficulty = 'easy'

/** 初始提示次数 */
export const INITIAL_HINTS = 3

/** 初始重排次数 */
export const INITIAL_SHUFFLES = 3

/** 基础消除分数 */
export const BASE_SCORE = 10

/** 连击加成系数 */
export const COMBO_MULTIPLIER = 1.5

/** 时间加成系数 */
export const TIME_BONUS_MULTIPLIER = 0.1

/** 连击重置时间（毫秒） */
export const COMBO_RESET_TIME = 2000

/** 动画持续时间（毫秒） */
export const ANIMATION_DURATION = {
  SELECT: 200,      // 选中动画
  PATH: 300,        // 路径动画
  REMOVE: 400,      // 消除动画
  SHUFFLE: 600,     // 重排动画
  HINT: 500,        // 提示动画
}

/** 图标资源路径 */
export const ICON_BASE_PATH = '/images/icons/'

/** 图标文件名列表（根据实际图标文件调整） */
export const ICON_FILES = [
  'icon-1.png',
  'icon-2.png',
  'icon-3.png',
  'icon-4.png',
  'icon-5.png',
  'icon-6.png',
  'icon-7.png',
  'icon-8.png',
  'icon-9.png',
  'icon-10.png',
  'icon-11.png',
  'icon-12.png',
  'icon-13.png',
  'icon-14.png',
  'icon-15.png',
  'icon-16.png',
  'icon-17.png',
  'icon-18.png',
  'icon-19.png',
  'icon-20.png',
  'icon-21.png',
  'icon-22.png',
  'icon-23.png',
  'icon-24.png',
  'icon-25.png',
  'icon-26.png',
  'icon-27.png',
  'icon-28.png',
  'icon-29.png',
  'icon-30.png',
]

/** 方块尺寸配置（rpx） */
export const TILE_SIZE = {
  WIDTH: 80,
  HEIGHT: 80,
  MARGIN: 4,
}

/** 路径线条配置 */
export const PATH_LINE = {
  WIDTH: 3,
  COLOR: '#ff6b6b',
}

