<template>
  <div
    :class="['game-tile', { selected: tile.selected, matched: tile.matched }]"
    :style="{
      width: size + 'px',
      height: size + 'px',
      margin: margin + 'px',
      backgroundColor: tileColor
    }"
  >
    <span v-if="tile.iconType > 0" class="tile-text">{{ tile.iconType }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tile } from '@link-link/shared'
import { TILE_SIZE, TILE_COLORS } from '@link-link/shared'

interface Props {
  tile: Tile
  size?: number
  margin?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: TILE_SIZE.WIDTH,
  margin: TILE_SIZE.MARGIN
})

const tileColor = computed(() => {
  if (props.tile.iconType === 0) return '#fff'
  return TILE_COLORS[(props.tile.iconType - 1) % TILE_COLORS.length]
})
</script>

<style scoped>
.game-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}

.game-tile:hover {
  transform: scale(1.05);
}

.game-tile.selected {
  transform: scale(1.1);
  border: 2px solid #ff6b6b;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

.game-tile.matched {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}

.tile-text {
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .tile-text {
    font-size: 14px;
  }
}
</style>
