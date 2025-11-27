<template>
  <section id="experience" class="section">
    <h2>{{ t('experience.title') }}</h2>
    <div class="timeline">
      <div 
        v-for="(exp, index) in experiences" 
        :key="index" 
        class="timeline-item"
      >
        <div class="timeline-marker">
          <img :src="exp.logo" :alt="exp.organization" class="logo" />
          <div class="timeline-line" v-if="index < experiences.length - 1"></div>
        </div>
        <div class="timeline-content">
          <h3>{{ exp.title }} - <a v-if="exp.link" :href="exp.link" target="_blank" class="highlight-link">{{ exp.organization }}</a><span v-else>{{ exp.organization }}</span> <span class="timeline-date">{{ exp.date }}</span></h3>
          <p>{{ exp.description }}</p>
          <div v-if="exp.details" class="exp-details">
            <div v-for="(detail, detailIndex) in exp.details" :key="detailIndex" class="p-close">
              <span v-if="detail.label" class="highlight-red">{{ detail.label }}:</span> {{ detail.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLocaleData } from '@/composables/useLocaleData';

const { t } = useI18n();
const experiences = useLocaleData('experience', 'data');
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

/* 时间轴相关样式 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  position: relative;
  z-index: 2;
}

.logo {
  width: 100px;
  padding: 5px;
  border-radius: 5px;
}

.timeline-line {
  width: 2px;
  height: 100%;
  background-color: #a0c1d9;
  margin-top: 10px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 20px;
}

.timeline-date {
  color: #888;
  font-weight: normal;
  font-size: 0.9rem;
}

.exp-details {
  margin-top: 0.5rem;
}

.p-close {
  margin-bottom: 0.3rem;
  color: #444;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .timeline {
    padding-left: 0;
  }
  
  .timeline::before {
    display: none;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-marker {
    margin-right: 0;
    margin-bottom: 10px;
    flex-direction: row;
  }
  
  .timeline-line {
    width: 100%;
    height: 2px;
    margin-top: 0;
    margin-left: 10px;
  }
}
</style>