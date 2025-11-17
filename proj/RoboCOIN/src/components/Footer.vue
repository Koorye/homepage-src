<template>
  <footer class="star-footer">

    
    <!-- 星空背景 -->
    <div class="stars">
      <div v-for="(star, index) in stars" :key="index" 
           class="star" :style="starStyle(star)"></div>
    </div>
    
    <!-- 内容区域 -->
    <div class="footer-content">
      <h3 class="open-source-date">{{ $t('footer.title') }}</h3>

      <div class="data-stats">
        <div class="stat-item">{{ $t('footer.boxes.robot') }}</div>
        <div class="stat-item">{{ $t('footer.boxes.data') }}</div>
        <div class="stat-item">{{ $t('footer.boxes.toolchain') }}</div>
      </div>
      
      <p class="invitation-text">
        {{ $t('footer.text') }}
      </p>
      
      <div class="qrcode-section">
        <div class="qrcode-container">
          <img class="qrcode-placeholder" src="../assets/qrcode.png" alt="QR Code" />
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      {{ $t('footer.copyright') }}
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 生成星星数据
const stars = ref([])

// 生成随机星星
const generateStars = () => {
  const starCount = 100
  const newStars = []
  
  for (let i = 0; i < starCount; i++) {
    newStars.push({
      id: i,
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    })
  }
  
  stars.value = newStars
}

// 星星样式
const starStyle = (star) => {
  return {
    top: star.top,
    left: star.left,
    width: star.size + 'px',
    height: star.size + 'px',
    animationDelay: star.delay + 's',
    animationDuration: star.duration + 's'
  }
}

// 组件挂载时生成星星
onMounted(() => {
  generateStars()
})
</script>

<style scoped>
/* 添加语言切换器样式 */
.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
}

.lang-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lang-btn.active {
  background: rgba(100, 150, 255, 0.6);
  border-color: rgba(100, 150, 255, 0.8);
}

/* 其余样式保持不变 */
.star-footer {
  position: relative;
  background: linear-gradient(135deg, #0a0e29 0%, #1a1f4b 100%);
  color: white;
  padding: 60px 20px 40px;
  text-align: center;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.star-footer {
  position: relative;
  background: linear-gradient(135deg, #0a0e29 0%, #1a1f4b 100%);
  color: white;
  padding: 60px 20px 40px;
  text-align: center;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 星星效果 */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: twinkle 4s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(0.8);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2);
  }
}

/* 内容布局 */
.footer-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.open-source-date {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 40px;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(100, 150, 255, 0.5);
}

.data-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.stat-item {
  font-size: 1.5rem;
  font-weight: 600;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.invitation-text {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 auto 40px;
  color: #e0e0ff;
  opacity: 0.9;
}

.qrcode-section {
  margin-bottom: 30px;
}

.qrcode-container {
  display: inline-block;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #666;
  border-radius: 20px;
}

.qq-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.scan-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.author-info {
  margin-top: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
}

.author-info div {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .star-footer {
    padding: 40px 15px 30px;
  }
  
  .open-source-date {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }
  
  .data-stats {
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .stat-item {
    font-size: 1.2rem;
    padding: 12px 20px;
  }
  
  .invitation-text {
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
  
  .qrcode-placeholder {
    width: 200px;
    height: 200px;
  }
  
  .qq-icon {
    font-size: 2.5rem;
  }
}
</style>