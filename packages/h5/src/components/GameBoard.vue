<template>
  <div class="game-board-container">
    <!-- 游戏信息栏 -->
    <div class="game-header">
      <div class="info-item">
        <span class="label">分数</span>
        <span class="value">{{ score }}</span>
      </div>
      <div class="info-item">
        <span class="label">时间</span>
        <span class="value">{{ timeDisplay }}</span>
      </div>
      <div class="info-item">
        <span class="label">连击</span>
        <span class="value combo">x{{ combo }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="game-controls">
      <button @click="onHint" :disabled="hints <= 0">
        提示 ({{ hints }})
      </button>
      <button @click="onShuffle" :disabled="shuffles <= 0">
        重排 ({{ shuffles }})
      </button>
      <button @click="onPause">暂停</button>
    </div>

    <!-- 游戏棋盘 -->
    <div class="game-board" :style="{ maxWidth: boardWidth + 'px' }">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="board-row">
        <GameTile
          v-for="tile in row"
          :key="tile.id"
          :tile="tile"
          @click="onTileClick(tile)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { GameDifficulty, Tile } from '@link-link/shared'
import {
  DIFFICULTY_CONFIGS,
  INITIAL_HINTS,
  INITIAL_SHUFFLES,
  BASE_SCORE,
  TILE_SIZE,
  ANIMATION_DURATION,
  COMBO_RESET_TIME,
  generateBoard,
  findPath,
  canMatch,
  removeTiles,
  findHint,
  checkGameOver,
  hasAvailableMatch,
  shuffleBoard,
  calculateScore
} from '@link-link/shared'
import GameTile from './GameTile.vue'

interface Props {
  difficulty: GameDifficulty
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'game-end', data: { won: boolean; score: number }): void
  (e: 'pause'): void
}>()

const board = ref<Tile[][]>([])
const score = ref(0)
const timeLeft = ref(0)
const combo = ref(0)
const hints = ref(INITIAL_HINTS)
const shuffles = ref(INITIAL_SHUFFLES)
const selectedTiles = ref<Tile[]>([])

let timer: number | null = null
let comboTimer: number | null = null

const timeDisplay = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const boardWidth = computed(() => {
  const config = DIFFICULTY_CONFIGS[props.difficulty]
  const calculatedWidth = config.cols * (TILE_SIZE.WIDTH + TILE_SIZE.MARGIN * 2) + 16
  // 限制最大宽度为视口宽度的 95%
  const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.95 : calculatedWidth
  return Math.min(calculatedWidth, maxWidth)
})

const initGame = () => {
  const config = DIFFICULTY_CONFIGS[props.difficulty]
  board.value = generateBoard(config)
  score.value = 0
  timeLeft.value = config.timeLimit
  combo.value = 0
  hints.value = INITIAL_HINTS
  shuffles.value = INITIAL_SHUFFLES
  selectedTiles.value = []
  
  startTimer()
}

const startTimer = () => {
  clearTimer()
  timer = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      gameOver(false)
    }
  }, 1000)
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const onTileClick = (tile: Tile) => {
  if (tile.iconType === 0 || tile.matched) return

  // 如果已经选中，取消选中
  if (selectedTiles.value.some(t => t.id === tile.id)) {
    deselectTile(tile)
    return
  }

  // 选中方块
  selectTile(tile)

  // 如果选中了两个方块
  if (selectedTiles.value.length === 2) {
    const [tile1, tile2] = selectedTiles.value

    if (canMatch(board.value, tile1, tile2)) {
      matchTiles(tile1, tile2)
    } else {
      setTimeout(() => {
        clearSelection()
      }, 300)
    }
  }
}

const selectTile = (tile: Tile) => {
  board.value[tile.row][tile.col].selected = true
  selectedTiles.value.push(tile)
}

const deselectTile = (tile: Tile) => {
  board.value[tile.row][tile.col].selected = false
  const index = selectedTiles.value.findIndex(t => t.id === tile.id)
  if (index > -1) {
    selectedTiles.value.splice(index, 1)
  }
}

const clearSelection = () => {
  selectedTiles.value.forEach(tile => {
    board.value[tile.row][tile.col].selected = false
  })
  selectedTiles.value = []
}

const matchTiles = (tile1: Tile, tile2: Tile) => {
  setTimeout(() => {
    removeTiles(board.value, tile1, tile2)
    
    const newCombo = combo.value + 1
    const newScore = score.value + calculateScore(BASE_SCORE, newCombo, 0)
    
    score.value = newScore
    combo.value = newCombo
    selectedTiles.value = []
    
    resetComboTimer()

    if (checkGameOver(board.value)) {
      gameOver(true)
    } else if (!hasAvailableMatch(board.value)) {
      autoShuffle()
    }
  }, ANIMATION_DURATION.PATH)
}

const resetComboTimer = () => {
  if (comboTimer) {
    clearTimeout(comboTimer)
  }
  
  comboTimer = window.setTimeout(() => {
    combo.value = 0
  }, COMBO_RESET_TIME)
}

const onHint = () => {
  if (hints.value <= 0) return
  
  const hint = findHint(board.value)
  if (hint) {
    const [tile1, tile2] = hint
    board.value[tile1.row][tile1.col].selected = true
    board.value[tile2.row][tile2.col].selected = true
    
    hints.value--

    setTimeout(() => {
      board.value[tile1.row][tile1.col].selected = false
      board.value[tile2.row][tile2.col].selected = false
    }, 2000)
  }
}

const onShuffle = () => {
  if (shuffles.value <= 0) return
  
  board.value = shuffleBoard(board.value)
  shuffles.value--
}

const autoShuffle = () => {
  alert('无可消除项，自动重排')
  setTimeout(() => {
    board.value = shuffleBoard(board.value)
  }, 1000)
}

const onPause = () => {
  clearTimer()
  emit('pause')
}

const gameOver = (won: boolean) => {
  clearTimer()
  emit('game-end', { won, score: score.value })
}

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  clearTimer()
  if (comboTimer) {
    clearTimeout(comboTimer)
  }
})

defineExpose({
  initGame,
  startTimer
})
</script>

<style scoped>
.game-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
}

.game-header {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 600px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-item .label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.info-item .value.combo {
  color: #ffd700;
}

.game-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.game-controls button {
  padding: 8px 16px;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.game-controls button:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.game-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-board {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow-x: auto;
}

.board-row {
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-board-container {
    padding: 5px;
  }
  
  .game-header {
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .info-item .label {
    font-size: 0.7rem;
  }
  
  .info-item .value {
    font-size: 1rem;
  }
  
  .game-controls button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .game-board {
    padding: 4px;
  }
}
</style>
