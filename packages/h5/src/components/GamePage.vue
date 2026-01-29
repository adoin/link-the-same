<template>
  <div class="game-page">
    <!-- 开始界面 -->
    <div v-if="gameStatus === 'ready'" class="start-screen">
      <h1 class="game-title">连连看</h1>
      <p class="game-subtitle">Link Link Game</p>
      
      <div class="difficulty-selector">
        <label>选择难度：</label>
        <div class="difficulty-options">
          <button
            v-for="diff in ['easy', 'medium', 'hard']"
            :key="diff"
            :class="['difficulty-option', { active: difficulty === diff }]"
            @click="selectDifficulty(diff as GameDifficulty)"
          >
            {{ difficultyLabels[diff] }}
          </button>
        </div>
      </div>

      <button class="start-btn" @click="startGame">开始游戏</button>
      
      <div class="game-rules">
        <h3>游戏规则</h3>
        <p>• 点击两个相同的图标进行消除</p>
        <p>• 连接路径不能超过2个转角</p>
        <p>• 连续消除可获得连击加成</p>
        <p>• 在时间结束前消除所有图标即可获胜</p>
      </div>
    </div>

    <!-- 游戏界面 -->
    <div v-if="gameStatus === 'playing'" class="game-screen">
      <GameBoard
        :difficulty="difficulty"
        @game-end="onGameEnd"
        @pause="onPause"
      />
    </div>

    <!-- 暂停界面 -->
    <div v-if="gameStatus === 'paused'" class="pause-screen">
      <div class="dialog">
        <h2>游戏暂停</h2>
        <button @click="resumeGame">继续游戏</button>
        <button @click="restartGame">重新开始</button>
        <button @click="exitGame">退出游戏</button>
      </div>
    </div>

    <!-- 游戏结束界面 -->
    <div v-if="gameStatus === 'won' || gameStatus === 'lost'" class="end-screen">
      <div class="dialog">
        <h2>{{ gameStatus === 'won' ? '恭喜通关！' : '游戏失败' }}</h2>
        <div class="score-display">
          <p>最终得分</p>
          <h1>{{ finalScore }}</h1>
        </div>
        <button @click="restartGame">再来一局</button>
        <button @click="exitGame">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GameStatus, GameDifficulty } from '@link-link/shared'
import { DEFAULT_DIFFICULTY } from '@link-link/shared'
import GameBoard from './GameBoard.vue'

const gameStatus = ref<GameStatus>('ready')
const difficulty = ref<GameDifficulty>(DEFAULT_DIFFICULTY)
const finalScore = ref(0)

const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

const selectDifficulty = (diff: GameDifficulty) => {
  difficulty.value = diff
}

const startGame = () => {
  gameStatus.value = 'playing'
}

const onPause = () => {
  gameStatus.value = 'paused'
}

const resumeGame = () => {
  gameStatus.value = 'playing'
}

const restartGame = () => {
  gameStatus.value = 'playing'
  finalScore.value = 0
}

const exitGame = () => {
  gameStatus.value = 'ready'
  finalScore.value = 0
}

const onGameEnd = (data: { won: boolean; score: number }) => {
  gameStatus.value = data.won ? 'won' : 'lost'
  finalScore.value = data.score
}
</script>

<style scoped>
.game-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

.start-screen,
.pause-screen,
.end-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.game-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.game-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.difficulty-selector {
  margin-bottom: 2rem;
}

.difficulty-selector label {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.difficulty-options {
  display: flex;
  gap: 1rem;
}

.difficulty-option {
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-option.active {
  background: white;
  color: #667eea;
  transform: scale(1.1);
}

.start-btn {
  padding: 1rem 3rem;
  background: white;
  color: #667eea;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  transition: transform 0.2s;
}

.start-btn:hover {
  transform: scale(1.05);
}

.game-rules {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.game-rules h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.game-rules p {
  font-size: 1rem;
  line-height: 1.8;
  text-align: left;
}

.dialog {
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  min-width: 400px;
}

.dialog h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.score-display {
  margin-bottom: 2rem;
}

.score-display p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.score-display h1 {
  color: #667eea;
  font-size: 3rem;
}

.dialog button {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #667eea;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.dialog button:hover {
  background: #5568d3;
}

.dialog button:last-child {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.dialog button:last-child:hover {
  background: rgba(102, 126, 234, 0.1);
}

.game-screen {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
}
</style>
