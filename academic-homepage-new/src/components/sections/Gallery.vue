<template>
  <section id="gallery" class="section">
    <h2>{{ t('gallery.title') }}</h2>
    <div class="gallery-container">
      <swiper 
        :modules="modules"
        :slides-per-view="3"
        :navigation="true"
        :effect="'coverflow'"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :coverflowEffect="{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }"
        :loop="true"
        class="my-swiper"
      >
        <swiper-slide 
          v-for="(photo, index) in galleryPhotos" 
          :key="index"
          class="swiper-slide-custom"
        >
          <div class="gallery-slide-content">
            <img 
              :src="photo.image" 
              :alt="photo.title" 
              class="gallery-image"
              loading="lazy"
            />
            <div class="gallery-caption">
              <h3>{{ photo.title }}</h3>
              <div class="photo-desc">{{ photo.description }}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLocaleData } from '@/composables/useLocaleData';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { 
  Navigation, 
  Pagination, 
  Scrollbar, 
  A11y, 
  EffectCoverflow,
  Autoplay 
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';

const { t } = useI18n();
const galleryPhotos = useLocaleData('gallery', 'data');

const modules = [Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay];
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

/* 相册特有样式 */
.gallery-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.my-swiper {
  --swiper-navigation-color: #fff;
  --swiper-pagination-color: #fff;
  --swiper-pagination-bullet-inactive-color: rgba(255, 255, 255, 0.5);
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-size: 10px;
  --swiper-pagination-bullet-horizontal-gap: 8px;
}

.swiper-slide-custom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-slide-content {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-slide-content:hover .gallery-image {
  transform: scale(1.05);
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  transform: translateY(0);
}

.gallery-caption h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.photo-desc {
  margin: 0;
  font-size: 0.95rem;
  color: #fff;
}

/* Swiper 导航按钮样式 */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transition: background 0.3s ease;
}

:deep(.swiper-button-prev:hover),
:deep(.swiper-button-next:hover) {
  background: rgba(0, 0, 0, 0.7);
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 18px;
  font-weight: bold;
}

/* Swiper 分页器样式 */
:deep(.swiper-pagination) {
  bottom: 20px;
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #fff;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .gallery-slide-content {
    height: 300px;
  }
  
  .gallery-caption {
    padding: 1.5rem 1rem 1rem;
  }
  
  .gallery-caption h3 {
    font-size: 1.1rem;
  }
  
  .photo-desc {
    font-size: 0.85rem;
  }
  
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 36px;
    height: 36px;
  }
  
  :deep(.swiper-button-prev::after),
  :deep(.swiper-button-next::after) {
    font-size: 16px;
  }
  
  /* 移动端 slides-per-view 改为1 */
  :deep(.swiper) {
    --swiper-slides-per-view: 1 !important;
  }
}
</style>