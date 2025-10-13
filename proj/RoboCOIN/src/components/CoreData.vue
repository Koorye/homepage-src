<template>
  <section class="core-data">
    <div class="container">
      <h2 class="section-title">Overview</h2>
      <div class="core-description">
        Dual-arm manipulation represents a critical capability for robots to perform complex tasks. 
        However, despite existing methods often relying on large-scale data, the scarcity of high-quality dual robot data-due to the inherent complexity of dual-arm coordination-remains a major obstacle. 
        Moreover, current datasets often lack detailed scene and physical interaction descriptions, which limits a model's capacity to reason about task logic and physical constraints.
        RoboCOIN addresses the critical challenge of high-quality data scarcity in dual-arm robot manipulation by introducing a large-scale dataset comprising over 100,000 demonstrations collected across 16robotic arm pairs.
        It encompasses more than 40 action types and 200 objects through hand-guided and teleoperated human demonstrations, providing multi-view visual observations and structured language descriptions, with a multidimensional task taxonomy covering diverse collaboration patterns and object properties.
        The core innovation lies in a hierarchical capability pyramid framework integrating trajectory-level annotations for global perception, segment-level labels for task planning, and frame-level details for inner-loop feedback.
        To support the development of the high-quality RoboCOIN dataset, we created a data processing framework.
        This framework implements quality assurance via a Robot Trajectory Markup Language (RTML) checker, generates rich hierarchical task descriptions through a multimodal-integrated semi-automatic toolchain, and an easy-to-use and flexible deployment system.
        Experimental results demonstrate that RoboCOIN significantly enhances performance and generalization in dual-arm manipulation tasks, with the full dataset and framework being open-sourced to support future research.
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">16</div>
          <div class="stat-label">Dual-Arm Embodiments</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">200K+</div>
          <div class="stat-label">Trajectories</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">8</div>
          <div class="stat-label">Scenarios</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">1K+</div>
          <div class="stat-label">Tasks</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CoreData'
}
</script>

<style scoped>
.core-data {
  padding: 3rem 0;
  background-color: #f8f9fa;
}

.core-description {
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #2c3e50;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  transition: transform 0.3s;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 1.2rem;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
}
</style>