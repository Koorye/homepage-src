import { createI18n } from 'vue-i18n'

import enAwards from './en/awards'
import zhAwards from './zh/awards'
import enExperience from './en/experience'
import zhExperience from './zh/experience'
import enGallery from './en/gallery'
import zhGallery from './zh/gallery'
import enHome from './en/home'
import zhHome from './zh/home'
import enIntroduction from './en/introduction'
import zhIntroduction from './zh/introduction'
import enNews from './en/news'
import zhNews from './zh/news'
import enPublications from './en/publications'
import zhPublications from './zh/publications'
import enSections from './en/sections'
import zhSections from './zh/sections'
import enSkills from './en/skills'
import zhSkills from './zh/skills'

const messages = {
  en: {
    awards: enAwards,
    experience: enExperience,
    gallery: enGallery,
    home: enHome,
    introduction: enIntroduction,
    news: enNews,
    publications: enPublications,
    sections: enSections,
    skills: enSkills
  },
  zh: {
    awards: zhAwards,
    experience: zhExperience,
    gallery: zhGallery,
    home: zhHome,
    introduction: zhIntroduction,
    news: zhNews,
    publications: zhPublications,
    sections: zhSections,
    skills: zhSkills
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: messages,
  runtimeOnly: false,
  compositionOnly: true
});

export default i18n;