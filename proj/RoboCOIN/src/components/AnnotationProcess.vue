<template>
  <section class="annotation-process">
    <div class="container">
      <h2 class="section-title">Data Processing Framework</h2>
      <div class="animation-container">
        <p class="description">
          Overview of our data processing framework. (a) Robot Trajectory Markup Language (RTML) for automated trajectory validation. 
          (b) Semi-automatic annotation toolchain for generating rich and hierarchical task descriptions. (c) CoRobot framework for easy-to-use and flexible robot training and deployment.
        </p>
        <img src="../assets/data_process.png" alt="Annotation Process Animation" />
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
  padding: 4rem 10%;

}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.description {
  /* text-align: center; */
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.animation-container {
  width: 100%;
}

img {
  width: 100%;
  height: auto;
}
</style>