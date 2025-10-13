<template>
  <section class="highlights">
    <div class="container">
      <h2 class="section-title">Highlights</h2>
      
      <div class="highlight-column">
        <div class="highlight-item">
          <RobotPie />
          <div class="highlight-content">
            <h3>Most Diverse Dual-Arm Robot Bodies</h3>
            <p>Includes 16 different robot models across three categories: dual-arm, semi-humanoid, and humanoid robots.</p>
          </div>
        </div>
        
        <div class="highlight-item">
          <ScenarioPie />
          <div class="highlight-content">
            <h3>Diverse Scenarios</h3>
            <p>Covers 8 different scenarios across residential, commercial, and office environments.</p>
          </div>
        </div>
      </div>
      
      <div class="highlight-item2">
        <ActionPie />
        <ObjectPie />
        <div class="highlight-content">
          <h3>Hierarchical Task Design</h3>
          <p>Tasks are organized in a hierarchical grid based on motion coordination and object variability.</p>
        </div>
      </div>
      
      <div class="highlight-item2">
        <div class="highlight-image">
          <div class="image-placeholder">Annotation Image</div>
        </div>
        <div class="highlight-content">
          <h3>Hierarchical Annotation</h3>
          <p>Provides scene-level, segment-level, and frame-level annotations for comprehensive analysis.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RobotPie from '@/components/charts/RobotPie.vue';
import ScenarioPie from '@/components/charts/ScenarioPie.vue';
import ActionPie from './charts/ActionPie.vue';
import ObjectPie from './charts/ObjectPie.vue';

export default {
  name: 'Highlights',
  components: {
    RobotPie,
    ScenarioPie,
    ActionPie,
    ObjectPie
  }
}
</script>

<style scoped>
.highlights {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
}

.highlight-column {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  /* centering  */
  justify-content: center;
  align-items: center;
}

.highlight-item {
  width: 50%;
}

.highlight-image {
  flex: 1;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.highlight-content {
  flex: 1;
}

.highlight-content h3 {
  font-size: 1.8rem;
  color: #2c3e50;
}

.highlight-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .highlight-item {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .highlight-image {
    width: 100%;
    height: 200px;
  }
}
</style>