<template>
  <section id="publications" class="section">
    <h2>{{ t('publications.title') }}</h2>
    <div class="publication-list">
      <div 
        v-for="(pub, index) in publications" 
        :key="index" 
        class="publication-item"
        @click="togglePublication(index)"
      >
        <div class="pub-header">
          <h3 v-html="pub.title"></h3>
          <span class="pub-date">{{ pub.date }}</span>
        </div>
        <div class="pub-body">
          <div class="publication-image">
            <img :src="pub.image" :alt="pub.title" />
          </div>
          <div class="publication-content">
            <p v-html="pub.description"></p>
            <div class="pub-tags">
              <span v-for="tag in pub.tags" :key="tag" class="keyword-tag">{{ tag }}</span>
            </div>
            <div v-if="pub.links" class="pub-links">
              <a 
                v-for="(link, key) in pub.links" 
                :key="key" 
                :href="link" 
                target="_blank" 
                class="pub-link-btn"
              >
                <span class="link-icon" v-html="getIcon(key)"></span> 
                {{ formatLinkText(key) }}
                <span v-if="key === 'code'" class="star-count">
                  <span v-if="starCounts[getRepoKey(link)] === 'loading'">
                    <i class="fas fa-spinner fa-spin"></i>
                  </span>
                  <span v-else-if="starCounts[getRepoKey(link)] === 'error'">
                    <i class="fas fa-exclamation-circle"></i>
                  </span>
                  <span v-else-if="starCounts[getRepoKey(link)] !== undefined">
                    <i class="fas fa-star"></i> {{ starCounts[getRepoKey(link)] }}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div class="pub-details" :class="{ 'show-details': expandedIndex === index }">
          <div class="detail-section">
            <h4>{{ t('publications.buttons.abstract') }}</h4>
            <p v-html="pub.abstract"></p>
          </div>
          <div class="detail-section">
            <h4>{{ t('publications.buttons.contributions') }}</h4>
            <ul>
              <li v-for="(contrib, i) in (pub.contributions)" :key="i">
                <p v-html="contrib"></p>
              </li>
            </ul>
          </div>
        </div>
        <div class="click-tip">{{ t('publications.buttons.click') }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useGitHubStars } from '@/composables/useGitHubStars';
import { useI18n } from 'vue-i18n';
import { useLocaleData } from '@/composables/useLocaleData';

const { t } = useI18n();

const publications = useLocaleData('publications', 'data');

// GitHub Stars相关
const { starCounts, getRepoKey, fetchStarsForRepos, fetchStars } = useGitHubStars();

// 展开/收起控制
const expandedIndex = ref(-1);
const togglePublication = (index) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index;
};

// 格式化链接文本
const formatLinkText = (key) => {
  return t(`publications.buttons.${key}`);
};

// 链接图标
const getIcon = (key) => {
  const iconMap = {
    project: '<i class="fas fa-globe"></i>',
    arxiv: '<i class="ai ai-arxiv"></i>',
    pdf: '<i class="fas fa-file-pdf"></i>',
    code: '<i class="fab fa-github"></i>'
  };
  return iconMap[key] || '';
};

// 监听publications变化，获取所有GitHub仓库的star数
watch(publications, (newPublications) => {
  if (newPublications && newPublications.length) {
    // 收集所有GitHub链接
    const githubUrls = [];
    newPublications.forEach(pub => {
      if (pub.links && pub.links.code) {
        githubUrls.push(pub.links.code);
      }
    });
    
    // 批量获取star数
    fetchStarsForRepos(githubUrls);
  }
}, { immediate: true });

// 也可以在点击时懒加载
const loadStarsOnClick = (link) => {
  const repoKey = getRepoKey(link);
  if (repoKey && !starCounts.value[repoKey]) {
    fetchStars(repoKey);
  }
};
</script>

<style scoped>
/* 原有样式保持不变 */
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

/* 出版物特有样式 */
.publication-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.publication-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  height: auto;
  cursor: pointer;
}

.publication-item:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 12px 20px rgba(0,0,0,0.15);
}

.pub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #eff4ff;
}

.pub-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0056b3;
}

.pub-date {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  background-color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #d1e7ff;
}

.pub-body {
  display: flex;
  flex: 1;
  padding-left: 10px;
}

.publication-image {
  flex: 0 0 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publication-image img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.publication-item:hover .publication-image img {
  transform: scale(1.03);
}

.publication-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.publication-content p {
  margin: 0;
  line-height: 1.6;
}

.pub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  display: inline-block;
  background-color: #e1f0fa;
  color: #2980b9;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.pub-links {
  margin-top: 1rem;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.pub-link-btn {
  padding: 4px 12px 4px 28px;
  position: relative;
  background-color: #e6f2ff;
  color: #0056b3;
  border-radius: 4px;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #d1e7ff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pub-link-btn:hover {
  background-color: #d1e7ff;
  transform: translateY(-2px);
}

.pub-link-btn .link-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1em;
}

/* Star 数样式增强 */
.star-count {
  color: #ff9800;
  font-weight: 600;
  font-size: 0.8em;
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-width: 20px;
}

.star-count .fa-spinner {
  color: #0056b3;
  font-size: 0.9em;
  animation: spin 1s linear infinite;
}

.star-count .fa-exclamation-circle {
  color: #e74c3c;
  font-size: 0.9em;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 详情区域样式 */
.pub-details {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.5s ease;
  padding: 0 1.5rem;
}

.pub-details.show-details {
  max-height: 1000px;
  opacity: 1;
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  color: #0056b3;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.detail-section p {
  font-size: 0.98rem;
  line-height: 1.7;
  color: #333;
}

.detail-section ul {
  padding-left: 1.8rem;
  margin: 0;
}

.detail-section li {
  font-size: 0.98rem;
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: #333;
}

.detail-section li:last-child {
  margin-bottom: 0;
}

.click-tip {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
  margin-bottom: 0.5rem;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  opacity: 1;
  visibility: visible;
}

.publication-item .pub-details.show-details + .click-tip {
  opacity: 0;
  visibility: hidden;
  height: 0;
  margin-bottom: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .pub-body {
    flex-direction: column;
  }
  
  .publication-image {
    flex: 0 0 200px;
  }
  
  .pub-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .pub-details.show-details {
    max-height: 2000px;
  }
}
</style>