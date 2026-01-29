/**
 * 游戏核心逻辑
 */

import type { GameConfig, Tile, Path, PathPoint } from './types'
import { MULTIPLE_NUMBER, DISRUPT_TIMES } from './constants'

/**
 * 生成游戏棋盘
 */
export function generateBoard(config: GameConfig): Tile[][] {
  const { rows, cols, iconTypes } = config
  const totalTiles = rows * cols

  if (totalTiles % 2 !== 0) {
    throw new Error('棋盘总格子数必须是偶数')
  }

  // 每种图标出现 MULTIPLE_NUMBER 对（即 2 * MULTIPLE_NUMBER 个）
  const tilesPerIcon = MULTIPLE_NUMBER * 2
  const totalIconsNeeded = iconTypes * tilesPerIcon
  
  if (totalIconsNeeded !== totalTiles) {
    throw new Error(`配置错误：${iconTypes}种图标 × ${tilesPerIcon}个/种 = ${totalIconsNeeded}个，但棋盘只有${totalTiles}个格子`)
  }

  const icons: number[] = []
  
  // 生成图标数组，每种图标出现 MULTIPLE_NUMBER 对
  for (let i = 1; i <= iconTypes; i++) {
    for (let j = 0; j < tilesPerIcon; j++) {
      icons.push(i)
    }
  }

  shuffleArray(icons)

  let board: Tile[][] = []
  let iconIndex = 0

  for (let row = 0; row < rows; row++) {
    board[row] = []
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        id: `${row}-${col}`,
        row,
        col,
        iconType: icons[iconIndex++],
        selected: false,
        matched: false,
      }
    }
  }

  for (let i = 0; i < DISRUPT_TIMES; i++) {
    board = disruptBoard(board)
  }

  return board
}

function disruptBoard(board: Tile[][]): Tile[][] {
  const rows = board.length
  const cols = board[0].length
  const allTiles: Tile[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].iconType > 0) {
        allTiles.push(board[row][col])
      }
    }
  }

  const iconTypes = allTiles.map(tile => tile.iconType)
  shuffleArray(iconTypes)

  let index = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].iconType > 0) {
        board[row][col].iconType = iconTypes[index++]
      }
    }
  }

  return board
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function findPath(board: Tile[][], start: Tile, end: Tile): Path | null {
  const straightPath = checkStraightPath(board, start, end)
  if (straightPath) return straightPath

  const oneCornerPath = checkOneCornerPath(board, start, end)
  if (oneCornerPath) return oneCornerPath

  const twoCornerPath = checkTwoCornerPath(board, start, end)
  if (twoCornerPath) return twoCornerPath

  return null
}

function checkStraightPath(board: Tile[][], start: Tile, end: Tile): Path | null {
  if (start.row === end.row) {
    const minCol = Math.min(start.col, end.col)
    const maxCol = Math.max(start.col, end.col)
    
    let clear = true
    for (let col = minCol + 1; col < maxCol; col++) {
      if (board[start.row][col].iconType > 0) {
        clear = false
        break
      }
    }
    
    if (clear) {
      return {
        points: [
          { row: start.row, col: start.col },
          { row: end.row, col: end.col },
        ],
        turns: 0,
      }
    }
  }

  if (start.col === end.col) {
    const minRow = Math.min(start.row, end.row)
    const maxRow = Math.max(start.row, end.row)
    
    let clear = true
    for (let row = minRow + 1; row < maxRow; row++) {
      if (board[row][start.col].iconType > 0) {
        clear = false
        break
      }
    }
    
    if (clear) {
      return {
        points: [
          { row: start.row, col: start.col },
          { row: end.row, col: end.col },
        ],
        turns: 0,
      }
    }
  }

  return null
}

function checkOneCornerPath(board: Tile[][], start: Tile, end: Tile): Path | null {
  const corner1 = { row: start.row, col: end.col }
  if (isEmptyOrTarget(board, corner1, end)) {
    if (
      isPathClear(board, start.row, start.col, corner1.row, corner1.col, 'horizontal') &&
      isPathClear(board, corner1.row, corner1.col, end.row, end.col, 'vertical')
    ) {
      return {
        points: [
          { row: start.row, col: start.col },
          corner1,
          { row: end.row, col: end.col },
        ],
        turns: 1,
      }
    }
  }

  const corner2 = { row: end.row, col: start.col }
  if (isEmptyOrTarget(board, corner2, end)) {
    if (
      isPathClear(board, start.row, start.col, corner2.row, corner2.col, 'vertical') &&
      isPathClear(board, corner2.row, corner2.col, end.row, end.col, 'horizontal')
    ) {
      return {
        points: [
          { row: start.row, col: start.col },
          corner2,
          { row: end.row, col: end.col },
        ],
        turns: 1,
      }
    }
  }

  return null
}

function checkTwoCornerPath(board: Tile[][], start: Tile, end: Tile): Path | null {
  const rows = board.length
  const cols = board[0].length

  for (let col = 0; col < cols; col++) {
    if (col === start.col) continue
    
    const corner1 = { row: start.row, col }
    const corner2 = { row: end.row, col }
    
    if (
      isEmptyOrTarget(board, corner1, end) &&
      isEmptyOrTarget(board, corner2, end) &&
      isPathClear(board, start.row, start.col, corner1.row, corner1.col, 'horizontal') &&
      isPathClear(board, corner1.row, corner1.col, corner2.row, corner2.col, 'vertical') &&
      isPathClear(board, corner2.row, corner2.col, end.row, end.col, 'horizontal')
    ) {
      return {
        points: [
          { row: start.row, col: start.col },
          corner1,
          corner2,
          { row: end.row, col: end.col },
        ],
        turns: 2,
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    if (row === start.row) continue
    
    const corner1 = { row, col: start.col }
    const corner2 = { row, col: end.col }
    
    if (
      isEmptyOrTarget(board, corner1, end) &&
      isEmptyOrTarget(board, corner2, end) &&
      isPathClear(board, start.row, start.col, corner1.row, corner1.col, 'vertical') &&
      isPathClear(board, corner1.row, corner1.col, corner2.row, corner2.col, 'horizontal') &&
      isPathClear(board, corner2.row, corner2.col, end.row, end.col, 'vertical')
    ) {
      return {
        points: [
          { row: start.row, col: start.col },
          corner1,
          corner2,
          { row: end.row, col: end.col },
        ],
        turns: 2,
      }
    }
  }

  return null
}

function isPathClear(
  board: Tile[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  direction: 'horizontal' | 'vertical'
): boolean {
  if (direction === 'horizontal') {
    const minCol = Math.min(startCol, endCol)
    const maxCol = Math.max(startCol, endCol)
    for (let col = minCol + 1; col < maxCol; col++) {
      if (board[startRow][col].iconType > 0) {
        return false
      }
    }
  } else {
    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    for (let row = minRow + 1; row < maxRow; row++) {
      if (board[row][startCol].iconType > 0) {
        return false
      }
    }
  }
  return true
}

function isEmptyOrTarget(board: Tile[][], point: PathPoint, target: Tile): boolean {
  const tile = board[point.row][point.col]
  return tile.iconType === 0 || (tile.row === target.row && tile.col === target.col)
}

export function canMatch(board: Tile[][], tile1: Tile, tile2: Tile): boolean {
  if (tile1.iconType !== tile2.iconType) return false
  if (tile1.row === tile2.row && tile1.col === tile2.col) return false
  return findPath(board, tile1, tile2) !== null
}

export function removeTiles(board: Tile[][], tile1: Tile, tile2: Tile): Tile[][] {
  board[tile1.row][tile1.col].iconType = 0
  board[tile1.row][tile1.col].matched = true
  board[tile2.row][tile2.col].iconType = 0
  board[tile2.row][tile2.col].matched = true
  return board
}

export function findHint(board: Tile[][]): [Tile, Tile] | null {
  const rows = board.length
  const cols = board[0].length

  for (let row1 = 0; row1 < rows; row1++) {
    for (let col1 = 0; col1 < cols; col1++) {
      const tile1 = board[row1][col1]
      if (tile1.iconType === 0) continue

      for (let row2 = 0; row2 < rows; row2++) {
        for (let col2 = 0; col2 < cols; col2++) {
          const tile2 = board[row2][col2]
          if (tile2.iconType === 0) continue
          if (row1 === row2 && col1 === col2) continue

          if (canMatch(board, tile1, tile2)) {
            return [tile1, tile2]
          }
        }
      }
    }
  }

  return null
}

export function checkGameOver(board: Tile[][]): boolean {
  for (const row of board) {
    for (const tile of row) {
      if (tile.iconType > 0) {
        return false
      }
    }
  }
  return true
}

export function hasAvailableMatch(board: Tile[][]): boolean {
  return findHint(board) !== null
}

export function shuffleBoard(board: Tile[][]): Tile[][] {
  return disruptBoard(board)
}

export function calculateScore(
  baseScore: number,
  combo: number,
  timeBonus: number
): number {
  const comboMultiplier = combo > 1 ? Math.pow(1.5, combo - 1) : 1
  return Math.floor(baseScore * comboMultiplier + timeBonus)
}
