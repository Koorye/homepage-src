<template>
  <div class="home-container">
    <Header />
    <CoverVideo />
    <CoreData />
    <Highlights />
    <RobotCarousel />
    <AnnotationProcess />
    <DatasetComparison />
    <Partners />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import CoverVideo from '@/components/CoverVideo.vue'
import CoreData from '@/components/CoreData.vue'
import Highlights from '@/components/Highlights.vue'
import InteractiveCharts from '@/components/InteractiveCharts.vue'
import RobotCarousel from '@/components/RobotCarousel.vue'
import AnnotationProcess from '@/components/AnnotationProcess.vue'
import DatasetComparison from '@/components/DatasetComparison.vue'
import Partners from '@/components/Partners.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Header,
    CoverVideo,
    CoreData,
    Highlights,
    InteractiveCharts,
    RobotCarousel,
    AnnotationProcess,
    DatasetComparison,
    Partners,
    Footer
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
}
</style>