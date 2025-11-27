<template>
  <section id="awards" class="section">
    <h2>{{ $t('awards.title') }}</h2>
    <div class="awards-grid">
      <div 
        v-for="(award, index) in awardsList" 
        :key="index" 
        class="award-item"
      >
        <div class="award-icon">{{ award.icon }}</div>
        <div class="award-content">
          <h3>{{ award.title }}</h3>
          <p>{{ award.issuer }} - {{ award.year }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useLocaleData } from '@/composables/useLocaleData'

const awardsList = useLocaleData('awards', 'data')
</script>

<style scoped>
.section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
}

.section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #0056b3;
  padding-bottom: 0.5rem;
}

/* 奖项特有样式 */
.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
}

.award-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0056b3;
  transition: transform 0.3s ease;
}

.award-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.award-icon {
  font-size: 2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.award-content h3 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;
}

.award-content p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .awards-grid {
    grid-template-columns: 1fr;
  }
}
</style>