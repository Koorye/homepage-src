<template>
  <section class="partners">
    <div class="container">
      <h2 class="section-title">{{ t('collaborating.title') }}</h2>
      <p class="description">{{ t('collaborating.desc') }}</p>
      <!-- 网格布局容器 -->
      <div class="partners-grid">
        <div 
          v-for="partner in partners" 
          :key="partner.id" 
          class="partner-item"
          @click="openExternalLink(partner.url)"
          @keydown.enter="openExternalLink(partner.url)"
          tabindex="0"
          role="button"
          :aria-label="`访问 ${partner.name} 官方网站`"
        >
          <div class="partner-logo">
            <img :src="partner.image" :alt="partner.name" />
          </div>
          <p class="partner-name">{{ partner.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 合作伙伴数据（包含外部链接）
const partners = [
  { 
    id: 1, 
    image: new URL('../assets/logos/uestc.png', import.meta.url).href,
    name: t('collaborating.institutions.uestc'),
    url: 'https://www.uestc.edu.cn/'
  },
  {
    id: 2,
    image: new URL('../assets/logos/bupt.png', import.meta.url).href,
    name: t('collaborating.institutions.bupt'),
    url: 'https://www.bupt.edu.cn/'
  },
  {
    id: 3,
    image: new URL('../assets/logos/ruc.png', import.meta.url).href,
    name: t('collaborating.institutions.ruc'),
    url: 'https://www.ruc.edu.cn/'
  },
  {
    id: 4,
    image: new URL('../assets/logos/hust.png', import.meta.url).href,
    name: t('collaborating.institutions.hust'),
    url: 'https://www.hust.edu.cn/'
  },
  {
    id: 5,
    image: new URL('../assets/logos/pku.png', import.meta.url).href,
    name: t('collaborating.institutions.pku'),
    url: 'https://www.pku.edu.cn/'
  },
  {
    id: 6,
    image: new URL('../assets/logos/thu.png', import.meta.url).href,
    name: t('collaborating.institutions.thu'),
    url: 'https://www.tsinghua.edu.cn/'
  },
  {
    id: 7,
    image: new URL('../assets/logos/stanford.png', import.meta.url).href,
    name: t('collaborating.institutions.stanford'),
    url: 'https://www.stanford.edu/'
  },
  {
    id: 8,
    image: new URL('../assets/logos/berkeley.png', import.meta.url).href,
    name: t('collaborating.institutions.berkeley'),
    url: 'https://www.berkeley.edu/'
  },
  { 
    id: 9, 
    image: new URL('../assets/logos/mayi.png', import.meta.url).href,
    name: t('collaborating.institutions.ant'),
    url: 'https://www.antgroup.com'
  },
  { 
    id: 10, 
    image: new URL('../assets/logos/galbot.png', import.meta.url).href,
    name: t('collaborating.institutions.galbot'),
    url: 'https://www.galbot.com'
  },
  { 
    id: 11, 
    image: new URL('../assets/logos/galaxea.png', import.meta.url).href,
    name: t('collaborating.institutions.galaxea'),
    url: 'https://galaxea-ai.com'
  },
  { 
    id: 12, 
    image: new URL('../assets/logos/leju.png', import.meta.url).href,
    name: t('collaborating.institutions.leju'),
    url: 'https://www.leju.com'
  },
  { 
    id: 13, 
    image: new URL('../assets/logos/agilex.png', import.meta.url).href,
    name: t('collaborating.institutions.agilex'),
    url: 'https://www.agilexrobots.com'
  },
  { 
    id: 14, 
    image: new URL('../assets/logos/tianqing.png', import.meta.url).href,
    name: t('collaborating.institutions.tianqing'),
    url: 'https://tqartisan.com'
  },
  { 
    id: 15, 
    image: new URL('../assets/logos/ai2.png', import.meta.url).href,
    name: t('collaborating.institutions.ai2'),
    url: 'https://ai2robotics.com'
  },
  { 
    id: 16, 
    image: new URL('../assets/logos/realman.png', import.meta.url).href,
    name: t('collaborating.institutions.realman'),
    url: 'https://develop.realman-robotics.com'
  },
  { 
    id: 17, 
    image: new URL('../assets/logos/booster.png', import.meta.url).href,
    name: t('collaborating.institutions.booster'),
    url: 'https://www.booster.tech'
  },
  { 
    id: 18, 
    image: new URL('../assets/logos/dora.png', import.meta.url).href,
    name: t('collaborating.institutions.dora'),
    url: 'https://doracc.com'
  },
];

// 打开外部链接的方法[5,6](@ref)
const openExternalLink = (url) => {
  if (url && url.startsWith('http')) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
</script>

<style scoped>
.partners {
  padding: 4rem 5%;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.description {
  text-align: center;
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

/* 网格布局 - 核心部分 */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  justify-items: center;
  align-items: start;
}

.partner-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 220px;
  min-height: 180px;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
}

.partner-item:hover {
  transform: translateY(-5px);
  border-color: #3498db;
}

.partner-item:focus {
  outline: none;
  border-color: #2980b9;
}

.partner-logo {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  padding: 10px;
}

.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: filter 0.3s ease;
}

.partner-name {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.partner-link-hint {
  position: absolute;
  bottom: 10px;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.partner-item:hover .partner-link-hint {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .partners-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .partners {
    padding: 2.5rem 0;
  }
  
  .container {
    padding: 0 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .partners-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .partner-item {
    padding: 1rem 0.5rem;
    min-height: 160px;
  }
  
  .partner-logo {
    width: 200px;
    height: 100px;
    margin-bottom: 0.75rem;
  }
  
  .partner-name {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .partners {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .partner-item {
    padding: 0.75rem 0.5rem;
    min-height: 140px;
  }
  
  .partner-logo {
    width: 200px;
    height: 100px;
  }
}

/* 小屏幕优化 - 单列布局 */
@media (max-width: 360px) {
  .partners-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .partner-item {
    max-width: 100%;
    min-height: 120px;
    flex-direction: row;
    text-align: left;
    padding: 1rem;
  }
  
  .partner-logo {
    width: 200px;
    height: 100px;
    margin-bottom: 0;
    margin-right: 1rem;
  }
  
  .partner-name {
    text-align: left;
    flex: 1;
  }
  
  .partner-link-hint {
    position: static;
    margin-left: 0.5rem;
    opacity: 1;
    font-size: 0.7rem;
  }
}
</style>