<template>
  <section id="news" class="section">
    <h2>{{ t('news.title') }}</h2>
    <div class="news-timeline">
      <div 
        v-for="(item, index) in newsList" 
        :key="index" 
        class="news-item"
      >
        <div class="news-date">{{ item.date }}</div>
        <div class="news-content">
          <p v-html="item.content"></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLocaleData } from '@/composables/useLocaleData';

const { t } = useI18n();
const newsList = useLocaleData('news', 'data');
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

/* News 特有样式 */
.news-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  position: relative;
}

.news-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #a0c1d9;
}

.news-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 0.8rem 0;
}

.news-date {
  min-width: 80px;
  font-weight: 600;
  color: #0056b3;
  font-size: 0.9rem;
  white-space: nowrap;
}

.news-content {
  flex: 1;
  background-color: #f8f9fa;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  border-left: 3px solid #a0c1d9;
}

.news-content p {
  margin: 0;
  line-height: 1.5;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .news-timeline {
    padding-left: 0;
  }
  
  .news-timeline::before {
    display: none;
  }
  
  .news-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .news-date {
    min-width: unset;
    color: #e74c3c;
  }
  
  .news-content {
    padding: 0.6rem 1rem;
  }
}
</style>