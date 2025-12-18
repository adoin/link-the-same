// game-tile.ts
import { TILE_SIZE } from '../../utils/constants'

// 预定义的颜色数组（30种不同颜色）
const TILE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84',
  '#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF',
  '#A29BFE', '#FD79A8', '#FFEAA7', '#55EFC4', '#81ECEC',
  '#FAB1A0', '#FF7675', '#DFE6E9', '#00CEC9', '#0984E3',
  '#6C5CE7', '#FDCB6E', '#E17055', '#D63031', '#00B894',
]

Component({
  properties: {
    tile: {
      type: Object as any,
      value: null,
    },
    size: {
      type: Number,
      value: TILE_SIZE.WIDTH,
    },
    margin: {
      type: Number,
      value: TILE_SIZE.MARGIN,
    },
  },

  data: {
    iconType: 0,
    selected: false,
    matched: false,
    tileColor: '#fff',
  },

  observers: {
    'tile': function(tile: Tile) {
      if (tile) {
        const tileColor = tile.iconType > 0 ? TILE_COLORS[(tile.iconType - 1) % TILE_COLORS.length] : '#fff'
        this.setData({
          iconType: tile.iconType,
          selected: tile.selected,
          matched: tile.matched,
          tileColor,
        })
      }
    },
  },

  methods: {
    onTileTap() {
      const tile = this.properties.tile as Tile
      
      if (!tile) {
        console.error('GameTile: tile 为空')
        return
      }
      
      if (tile.iconType > 0 && !tile.matched) {
        // 触发自定义事件，传递 tile 数据
        this.triggerEvent('tileclick', { tile })
      }
    },
  },
})
