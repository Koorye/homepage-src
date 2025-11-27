<template>
  <div id="introduction">
    <header class="content-header">
      <h1 v-html="$t('introduction.name')"></h1>
      <a href="mailto:shihan.wu.koorye@outlook.com" class="highlight-link">
        shihan.wu.koorye@outlook.com
      </a>
    </header>
    <section class="section">
      <p v-for="(paragraph, index) in introductionData" :key="index" v-html="paragraph"></p>
    </section>
  </div>
</template>

<script setup>
import { useLocaleData } from '@/composables/useLocaleData';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({
  useScope: 'global',
  inheritLocale: true,
});

const introductionData = useLocaleData('introduction', 'data');
</script>

<style scoped>
/* Banner 样式 */
.banner-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  transition: max-height 1.0s cubic-bezier(0.6, 0, 0.4, 1), 
              box-shadow 0.3s ease;
  will-change: max-height;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
  display: block;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  transition: mask-image 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
              -webkit-mask-image 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.banner-container:hover {
  max-height: 2000px;
}

.banner-container:hover .banner {
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
  transform: translateZ(0) scale(1.02);
  -webkit-transform: translateZ(0) scale(1.02);
}

.banner-caption {
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1.5rem;
  transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-container:hover + .banner-caption {
  color: #555;
}

.content-header {
  margin-bottom: 0.5rem;
  padding-bottom: 1.5rem;
}

.content-header h1 {
  font-size: 4.5rem;
  font-weight: 700;
  margin-top: -3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

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

.section p {
  line-height: 1.6;
  color: #444;
}

.highlight-red {
  color: #e74c3c;
  font-weight: 600;
}

.highlight-link {
  color: #2980b9;
  text-decoration: none;
  font-weight: 600;
}

.highlight-link:hover {
  text-decoration: underline;
}
</style>