<template>
  <section id="skills" class="section">
    <h2>{{ t('skills.title') }}</h2>
    <div class="skills-container">
      <div 
        v-for="(skillGroup, index) in skillGroups" 
        :key="index" 
        class="skill-category"
      >
        <h3>{{ skillGroup.category }}</h3>
        <div class="skills-list">
          <div 
            v-for="(skill, skillIndex) in skillGroup.skills" 
            :key="skillIndex" 
            class="skill-item"
          >
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div 
                class="skill-progress" 
                :style="{ width: skill.level + '%' }"
                :class="getSkillLevelClass(skill.level)"
              ></div>
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
const skillGroups = useLocaleData('skills', 'data');

// 技能等级样式类
const getSkillLevelClass = (level) => {
  if (level >= 90) return 'skill-expert';
  if (level >= 80) return 'skill-advanced';
  if (level >= 70) return 'skill-intermediate';
  return 'skill-beginner';
};
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

/* 技能特有样式 */
.skills-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.skill-category {
  flex: 1;
  min-width: 250px;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #0056b3;
}

.skill-category h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.2rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-weight: 500;
}

.skill-level {
  font-size: 0.9rem;
  color: #666;
}

.skill-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.skill-expert {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
}

.skill-advanced {
  background: linear-gradient(90deg, #3498db, #2980b9);
}

.skill-intermediate {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

.skill-beginner {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .skills-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .skill-category {
    width: 100%;
    min-width: unset;
  }
}
</style>