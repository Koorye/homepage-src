<template>
  <section class="annotation-process">
    <div class="container">
      <h2 class="section-title">Hierarchical Annotation Process</h2>
      <div class="animation-container">
        <div class="animation-placeholder">
          Annotation Process Animation
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AnnotationProcess'
}
</script>

<style scoped>
.annotation-process {
  padding: 4rem 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.animation-container {
  height: 400px;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.animation-placeholder {
  font-size: 1.5rem;
  color: #7f8c8d;
}
</style>