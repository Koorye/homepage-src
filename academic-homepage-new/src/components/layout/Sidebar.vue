<template>
  <aside class="sidebar">
    <div class="profile-section">
      <img class="avatar" src="../../assets/profile.png" alt="Profile Picture" />
      <h1 class="name">{{ t('sections.name') }}</h1>
      <!-- <p class="location">shihan.wu.koorye@outlook.com</p> -->
      <div class="location">
        <a href="mailto:shihan.wu.koorye@outlook.com">shihan.wu.koorye@outlook.com</a>
      </div>
    </div>
    
    <nav class="navigation">
      <ul>
        <li 
          v-for="section in sections" 
          :key="section.id"
          @click="scrollToSection(section.id)"
        >
          {{ section.title }}
        </li>
      </ul>
    </nav>
    
    <div class="contact-info">
      <p class="contact-title">{{ t('sections.contact.find') }}</p>
      <div class="contact-links">
        <a href="https://github.com/Koorye" target="_blank" class="contact-link" title="GitHub">
          <img src="../../assets/icons/github.svg" alt="GitHub" class="contact-icon" />
          <span class="contact-text">{{ t('sections.contact.github') }}</span>
        </a>
        <a href="https://koorye.github.io/blog" target="_blank" class="contact-link" title="Blog">
          <img src="../../assets/icons/blog.svg" alt="Blog" class="contact-icon" />
          <span class="contact-text">{{ t('sections.contact.blog') }}</span>
        </a>
        <a href="https://scholar.google.com/citations?user=7VCaV5EAAAAJ&hl=zh-CN" target="_blank" class="contact-link" title="Google Scholar">
          <img src="../../assets/icons/google-scholar.svg" alt="Google Scholar" class="contact-icon" />
          <span class="contact-text">{{ t('sections.contact.gs') }}</span>
        </a>
        <a href="https://dblp.org/pid/132/9517-1" target="_blank" class="contact-link" title="DBLP">
          <img src="../../assets/icons/dblp.svg" alt="DBLP" class="contact-icon" />
          <span class="contact-text">{{ t('sections.contact.dblp') }}</span>
        </a>
      </div>
      
      <!-- 左右切换式语言按钮 -->
      <div class="language-toggle">
        <button 
          class="toggle-btn"
          :class="{ active: locale === 'en' }"
          @click="switchLanguage('en')"
        >
          EN
        </button>
        <div class="toggle-slider" :style="{ transform: `translateX(${locale === 'zh' ? '100%' : '0'})` }"></div>
        <button 
          class="toggle-btn"
          :class="{ active: locale === 'zh' }"
          @click="switchLanguage('zh')"
        >
          中文
        </button>
      </div>

      <p class="contact-desc">{{ t('sections.copyright') }}</p>
    </div>
  </aside>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useScroll } from '@/composables/useScroll'
import { useI18n } from 'vue-i18n'
import { useLocaleData } from '@/composables/useLocaleData'

const { t, locale } = useI18n({ useScope: 'global' })

const sections = useLocaleData('sections', 'nav')

const emit = defineEmits(['scrollToSection'])
const { scrollToSection } = useScroll(sections)

// 切换语言方法
const switchLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('preferred-language', lang)
}

// 从本地存储加载
const savedLang = localStorage.getItem('preferred-language')
if (savedLang) {
  locale.value = savedLang
}
</script>

<style scoped>
/* 侧边栏相关样式 */
.sidebar {
  width: 280px;
  background-color: #e6f2ff;
  padding: 2rem 1.5rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.profile-section {
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #a0c1d9;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
}

.name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.location {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.location a {
  color: #555;
  text-decoration: none;
}

.location a:hover {
  text-decoration: underline;
}

.navigation {
  flex: 1;
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navigation li {
  padding: 0.3rem 0rem;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
  text-align: center;
}

.navigation li:hover {
  background-color: #c2d9f0;
}

.navigation li.active {
  background-color: #a0c1d9;
  color: white;
}

/* 联系信息样式 */
.contact-info {
  text-align: center;
  padding: 1rem 0;
}

.contact-title {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.contact-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  padding: 0 0.5rem;
}

.contact-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
  background-color: #f0f7ff;
  padding: 0.6rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.contact-link:hover {
  background-color: #d1e7ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.contact-icon {
  width: 22px;
  height: 22px;
  display: inline-block;
}

.contact-text {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.contact-desc {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
}

/* 左右切换式语言按钮样式 */
.language-toggle {
  position: relative;
  display: inline-flex;
  border-radius: 20px;
  background-color: #d1e7ff;
  overflow: hidden;
  margin: 12px 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 2;
  transition: color 0.3s ease;
}

.toggle-btn.active {
  color: white;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  background-color: #4a89dc;
  border-radius: 20px;
  transition: transform 0.3s ease;
  z-index: 1;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }
  
  .contact-links {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
  
  .contact-link {
    padding: 0.5rem 0.5rem;
  }
  
  .toggle-btn {
    padding: 6px 16px;
    font-size: 0.8rem;
  }
}
</style>