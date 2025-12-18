// game-board.ts
import {
  generateBoard,
  findPath,
  canMatch,
  removeTiles,
  findHint,
  checkGameOver,
  hasAvailableMatch,
  shuffleBoard,
  calculateScore,
} from '../../utils/game-logic'
import {
  DIFFICULTY_CONFIGS,
  DEFAULT_DIFFICULTY,
  INITIAL_HINTS,
  INITIAL_SHUFFLES,
  BASE_SCORE,
  TILE_SIZE,
  ANIMATION_DURATION,
  COMBO_RESET_TIME,
} from '../../utils/constants'

Component({
  properties: {
    difficulty: {
      type: String as any,
      value: DEFAULT_DIFFICULTY,
    },
  },

  data: {
    board: [] as Tile[][],
    score: 0,
    timeLeft: 0,
    timeDisplay: '00:00',
    combo: 0,
    hints: INITIAL_HINTS,
    shuffles: INITIAL_SHUFFLES,
    selectedTiles: [] as Tile[],
    showPath: false,
    boardWidth: 0,
    boardHeight: 0,
  },

  lifetimes: {
    attached() {
      console.log('GameBoard attached')
      this.initGame()
    },

    detached() {
      console.log('GameBoard detached')
      this.clearTimer()
    },
  },

  methods: {
    /**
     * 初始化游戏
     */
    initGame() {
      console.log('初始化游戏...')
      try {
        const difficulty = this.properties.difficulty as GameDifficulty
        const config = DIFFICULTY_CONFIGS[difficulty]
        console.log('游戏配置:', config)
        
        // 生成棋盘
        const board = generateBoard(config)
        console.log('棋盘生成成功，大小:', board.length, 'x', board[0].length)
        
        // 计算棋盘尺寸
        const boardWidth = config.cols * (TILE_SIZE.WIDTH + TILE_SIZE.MARGIN * 2) + 32
        const boardHeight = config.rows * (TILE_SIZE.HEIGHT + TILE_SIZE.MARGIN * 2) + 32
        
        this.setData({
          board,
          score: 0,
          timeLeft: config.timeLimit,
          timeDisplay: this.formatTime(config.timeLimit),
          combo: 0,
          hints: INITIAL_HINTS,
          shuffles: INITIAL_SHUFFLES,
          selectedTiles: [],
          showPath: false,
          boardWidth,
          boardHeight,
        })

        console.log('游戏初始化完成')
        // 启动计时器
        this.startTimer()
      } catch (error) {
        console.error('游戏初始化失败:', error)
        wx.showToast({
          title: '游戏初始化失败',
          icon: 'none',
        })
      }
    },

    /**
     * 启动计时器
     */
    startTimer() {
      console.log('启动计时器')
      this.clearTimer()
      this.timer = setInterval(() => {
        const timeLeft = this.data.timeLeft - 1
        this.setData({ 
          timeLeft,
          timeDisplay: this.formatTime(timeLeft)
        })

        if (timeLeft <= 0) {
          console.log('时间到，游戏失败')
          this.gameOver(false)
        }
      }, 1000)
    },

    /**
     * 清除计时器
     */
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    /**
     * 格式化时间显示
     */
    formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    /**
     * 处理方块点击
     */
    onTileTap(e: any) {
      if (!e.detail || !e.detail.tile) {
        console.error('GameBoard: 事件数据错误，没有 tile')
        return
      }
      
      const { tile } = e.detail
      console.log('点击方块:', tile.row, tile.col, '图标:', tile.iconType)
      
      // 检查方块是否有效
      if (!tile || tile.iconType === 0 || tile.matched) {
        console.log('方块无效或已消除')
        return
      }
      
      const { selectedTiles, board } = this.data

      // 如果已经选中，取消选中
      if (selectedTiles.some(t => t.id === tile.id)) {
        console.log('取消选中')
        this.deselectTile(tile)
        return
      }

      // 选中方块
      this.selectTile(tile)

      // 如果选中了两个方块
      if (this.data.selectedTiles.length === 2) {
        const [tile1, tile2] = this.data.selectedTiles
        console.log('检查两个方块是否可以消除:', tile1.iconType, tile2.iconType)

        // 检查是否可以消除
        if (canMatch(board, tile1, tile2)) {
          console.log('可以消除！')
          this.matchTiles(tile1, tile2)
        } else {
          console.log('不能消除')
          // 不能消除，清除选择
          setTimeout(() => {
            this.clearSelection()
          }, 300)
        }
      }
    },

    /**
     * 选中方块
     */
    selectTile(tile: Tile) {
      const { board, selectedTiles } = this.data
      board[tile.row][tile.col].selected = true
      selectedTiles.push(tile)
      
      this.setData({
        board,
        selectedTiles,
      })
      console.log('已选中方块数:', selectedTiles.length)
    },

    /**
     * 取消选中方块
     */
    deselectTile(tile: Tile) {
      const { board, selectedTiles } = this.data
      board[tile.row][tile.col].selected = false
      
      const index = selectedTiles.findIndex(t => t.id === tile.id)
      if (index > -1) {
        selectedTiles.splice(index, 1)
      }
      
      this.setData({
        board,
        selectedTiles,
      })
    },

    /**
     * 清除所有选择
     */
    clearSelection() {
      const { board, selectedTiles } = this.data
      
      selectedTiles.forEach(tile => {
        board[tile.row][tile.col].selected = false
      })
      
      this.setData({
        board,
        selectedTiles: [],
        showPath: false,
      })
    },

    /**
     * 消除匹配的方块
     */
    matchTiles(tile1: Tile, tile2: Tile) {
      const { board, score, combo } = this.data
      console.log('开始消除动画...')
      
      // 延迟消除，显示动画
      setTimeout(() => {
        // 消除方块
        removeTiles(board, tile1, tile2)
        
        // 计算分数
        const newCombo = combo + 1
        const newScore = score + calculateScore(BASE_SCORE, newCombo, 0)
        
        console.log('消除成功！得分:', newScore, '连击:', newCombo)
        
        this.setData({
          board,
          score: newScore,
          combo: newCombo,
          selectedTiles: [],
          showPath: false,
        })

        // 重置连击计时器
        this.resetComboTimer()

        // 检查游戏是否结束
        if (checkGameOver(board)) {
          console.log('所有方块已消除，游戏胜利！')
          this.gameOver(true)
        } else if (!hasAvailableMatch(board)) {
          console.log('没有可消除的对，自动重排')
          this.autoShuffle()
        }
      }, ANIMATION_DURATION.PATH)
    },

    /**
     * 重置连击计时器
     */
    resetComboTimer() {
      if (this.comboTimer) {
        clearTimeout(this.comboTimer)
      }
      
      this.comboTimer = setTimeout(() => {
        console.log('连击重置')
        this.setData({ combo: 0 })
      }, COMBO_RESET_TIME)
    },

    /**
     * 提示功能
     */
    onHint() {
      const { board, hints } = this.data
      console.log('使用提示，剩余次数:', hints)
      
      if (hints <= 0) return
      
      const hint = findHint(board)
      if (hint) {
        const [tile1, tile2] = hint
        console.log('提示方块:', tile1.row, tile1.col, '-', tile2.row, tile2.col)
        
        // 高亮提示方块
        board[tile1.row][tile1.col].selected = true
        board[tile2.row][tile2.col].selected = true
        
        this.setData({
          board,
          hints: hints - 1,
        })

        // 2秒后取消高亮
        setTimeout(() => {
          board[tile1.row][tile1.col].selected = false
          board[tile2.row][tile2.col].selected = false
          this.setData({ board })
        }, 2000)
      } else {
        console.log('没有找到可消除的对')
        wx.showToast({
          title: '没有可消除的对',
          icon: 'none',
        })
      }
    },

    /**
     * 重排功能
     */
    onShuffle() {
      const { board, shuffles } = this.data
      console.log('重排棋盘，剩余次数:', shuffles)
      
      if (shuffles <= 0) return
      
      const newBoard = shuffleBoard(board)
      
      this.setData({
        board: newBoard,
        shuffles: shuffles - 1,
      })
    },

    /**
     * 自动重排（无可消除对时）
     */
    autoShuffle() {
      wx.showToast({
        title: '无可消除项，自动重排',
        icon: 'none',
      })
      
      setTimeout(() => {
        const { board } = this.data
        const newBoard = shuffleBoard(board)
        this.setData({ board: newBoard })
      }, 1000)
    },

    /**
     * 暂停游戏
     */
    onPause() {
      console.log('暂停游戏')
      this.clearTimer()
      this.triggerEvent('pause')
    },

    /**
     * 游戏结束
     */
    gameOver(won: boolean) {
      console.log('游戏结束:', won ? '胜利' : '失败')
      this.clearTimer()
      
      const { score } = this.data
      this.triggerEvent('gameend', { won, score })
    },
  },

  // 私有属性
  timer: null as any,
  comboTimer: null as any,
})
