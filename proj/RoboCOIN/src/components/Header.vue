<template>
  <header class="header">
    <div class="logo">
      <img class="logo-image" src="../assets/logo.svg" alt="RoboCOIN Logo" />
      <div class="logo-text">RoboCOIN</div>
      <img class="logo-image2" src="/logos/baai.png" alt="Robot Icon" />
    </div>
    <nav class="nav-links">
      <!-- <a href="#" class="nav-link">Download</a>
      <a href="#" class="nav-link">GitHub</a>
      <a href="#" class="nav-link">Visualization</a>
      <a href="#" class="nav-link">About Us</a> -->
      <div class="nav-link">
        <img class="nav-icon" src="/icons/download.svg" alt="Download Icon" />
        <a class="nav-item" href="#" target="_blank">Download</a>
      </div>
      <div class="nav-link">
        <img class="nav-icon" src="/icons/github.svg" alt="GitHub Icon" />
        <a class="nav-item" href="https://github.com" target="_blank">GitHub</a>
      </div>
      <div class="nav-link">
        <img class="nav-icon" src="/icons/visualize.svg" alt="Visualization Icon" />
        <a class="nav-item" href="#" target="_blank">Visualization</a>
      </div>
      <div class="nav-link">
        <img class="nav-icon" src="/icons/about.svg" alt="About Us Icon" />
        <a class="nav-item" href="#" target="_blank">About Us</a>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #19242e;
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.5rem;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.logo-image {
  height: 50px;
  width: 50px;
  margin-right: 1rem;
}

.logo-image2 {
  height: 50px;
  margin-left: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-icon {
  height: 25px;
  width: 25px;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-links {
    margin-top: 1rem;
    gap: 1rem;
  }
}
</style>