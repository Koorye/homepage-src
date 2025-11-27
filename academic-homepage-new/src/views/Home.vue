<template>
  <div class="home-container">
    <Sidebar />
    
    <main class="content">
      <div class="banner-container">
        <img src="../assets/banner.jpg" alt="Banner" class="banner" />
      </div>
      <p class="banner-caption" v-html="t('home.banner')"></p>
      <div class="content-wrapper">
        <Introduction />
        <Experience />
        <News />
        <Publications />
        <Awards />
        <Skills />
        <Gallery />
      </div>
      <div class="map-wrapper">
        <h3 class="highlight-blue">{{ t('home.map') }}</h3>
        <div class="map-container" ref="mapContainer"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// 导入组件
import Sidebar from '@/components/layout/Sidebar.vue';
import Introduction from '@/components/sections/Introduction.vue';
import Experience from '@/components/sections/Experience.vue';
import News from '@/components/sections/News.vue';
import Publications from '@/components/sections/Publications.vue';
import Awards from '@/components/sections/Awards.vue';
import Skills from '@/components/sections/Skills.vue';
import Gallery from '@/components/sections/Gallery.vue';

// 导入组合式函数
const { t } = useI18n();

const mapContainer = ref(null);
let scriptElement = null;

onMounted(() => {
  // 检查脚本是否已经存在
  if (document.getElementById('mapmyvisitors')) {
    return;
  }
  
  // 创建脚本元素
  scriptElement = document.createElement('script');
  scriptElement.id = 'mapmyvisitors';
  scriptElement.type = 'text/javascript';
  scriptElement.src = '//mapmyvisitors.com/map.js?cl=2c37b1&w=a&t=n&d=ls-3Plf1605cuP3jr7En9809TySixy9TuZAJlI_DmFg&co=ffffff&cmo=3acc3a&cmn=ff5353&ct=808080';
  
  // 添加到容器或body中
  if (mapContainer.value) {
    mapContainer.value.appendChild(scriptElement);
  } else {
    document.body.appendChild(scriptElement);
  }
});

onUnmounted(() => {
  // 组件卸载时清理脚本，防止内存泄漏
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement);
  }
  
  // 也可以清理生成的地图元素
  const mapElement = document.querySelector('.mapmyvisitors-map');
  if (mapElement && mapElement.parentNode) {
    mapElement.parentNode.removeChild(mapElement);
  }
});
</script>

<style scoped>
/* 全局布局样式 */
.home-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  overflow: hidden;
}

.content {
  flex: 1;
  margin-left: 280px;
  overflow-y: auto;
  height: 100vh;
  background-color: white;
}

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

.content-wrapper {
  padding: 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.highlight-blue-bold {
  color: #3498db;
  font-weight: 700;
}

.map-wrapper {
  text-align: center;
}

.map-container {
  display: flex;
  justify-content: center;
  border-radius: 8px;
  max-width: 600px;
  margin: 0rem auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    overflow: auto;
  }
  
  .content {
    margin-left: 0;
    height: auto;
    overflow-y: visible;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .content-header h1 {
    font-size: 3rem;
    margin-top: 0;
  }
  
  /* Banner 移动端适配 */
  .banner-container {
    max-height: 200px;
    transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .banner {
    transition: mask-image 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                -webkit-mask-image 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@media (min-width: 1200px) {
  .content-wrapper {
    padding: 3rem 4rem;
  }
}

/* 滚动条样式优化 */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>