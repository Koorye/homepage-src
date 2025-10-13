<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <img src="/logos/baai.png" alt="BAAI Logo" style="height: 50px;" />
        <p>&copy; 2025 RoboCOIN Dataset. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>