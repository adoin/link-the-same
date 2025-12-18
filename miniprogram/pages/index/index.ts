// index.ts
import { DEFAULT_DIFFICULTY } from '../../utils/constants'

Component({
  data: {
    gameStatus: 'ready' as GameStatus,
    difficulty: DEFAULT_DIFFICULTY as GameDifficulty,
    finalScore: 0,
  },

  lifetimes: {
    attached() {
      console.log('页面加载，当前状态:', this.data.gameStatus)
    },
  },

  methods: {
    /**
     * 选择难度
     */
    selectDifficulty(e: any) {
      const { difficulty } = e.currentTarget.dataset
      console.log('选择难度:', difficulty)
      this.setData({ difficulty })
    },

    /**
     * 开始游戏
     */
    startGame() {
      console.log('开始游戏，难度:', this.data.difficulty)
      this.setData({ gameStatus: 'playing' })
    },

    /**
     * 暂停游戏
     */
    onPause() {
      console.log('暂停游戏')
      this.setData({ gameStatus: 'paused' })
    },

    /**
     * 继续游戏
     */
    resumeGame() {
      console.log('继续游戏')
      this.setData({ gameStatus: 'playing' })
      
      // 通知 GameBoard 组件继续计时
      const gameBoard = this.selectComponent('#gameBoard') as any
      if (gameBoard && gameBoard.startTimer) {
        gameBoard.startTimer()
      }
    },

    /**
     * 重新开始游戏
     */
    restartGame() {
      console.log('重新开始游戏')
      this.setData({ 
        gameStatus: 'playing',
        finalScore: 0,
      })
      
      // 重新初始化 GameBoard
      setTimeout(() => {
        const gameBoard = this.selectComponent('#gameBoard') as any
        if (gameBoard && gameBoard.initGame) {
          gameBoard.initGame()
        }
      }, 100)
    },

    /**
     * 退出游戏
     */
    exitGame() {
      console.log('退出游戏')
      this.setData({ 
        gameStatus: 'ready',
        finalScore: 0,
      })
    },

    /**
     * 游戏结束回调
     */
    onGameEnd(e: any) {
      const { won, score } = e.detail
      console.log('游戏结束:', won ? '胜利' : '失败', '得分:', score)
      
      this.setData({
        gameStatus: won ? 'won' : 'lost',
        finalScore: score,
      })

      wx.showToast({
        title: won ? '恭喜通关！' : '游戏失败',
        icon: won ? 'success' : 'none',
        duration: 2000,
      })
    },
  },
})
