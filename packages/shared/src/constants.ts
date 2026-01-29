/**
 * 游戏常量配置
 */

import type { DifficultyConfigs, GameDifficulty } from './types'

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

/** 方块尺寸配置（px，H5使用） */
export const TILE_SIZE = {
  WIDTH: 35,
  HEIGHT: 35,
  MARGIN: 2,
}

/** 路径线条配置 */
export const PATH_LINE = {
  WIDTH: 3,
  COLOR: '#ff6b6b',
}

/** 预定义的颜色数组（30种不同颜色） */
export const TILE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84',
  '#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF',
  '#A29BFE', '#FD79A8', '#FFEAA7', '#55EFC4', '#81ECEC',
  '#FAB1A0', '#FF7675', '#DFE6E9', '#00CEC9', '#0984E3',
  '#6C5CE7', '#FDCB6E', '#E17055', '#D63031', '#00B894',
]
