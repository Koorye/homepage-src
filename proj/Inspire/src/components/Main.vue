<script>
import Title from './sections/Title.vue'
import Abstract from './sections/Abstract.vue'
import Motivation from './sections/Motivation.vue'
import Method from './sections/Method.vue'
import ExperimentLibero from './sections/ExperimentLibero.vue'
import ExperimentReal from './sections/ExperimentReal.vue'
import ExperimentFactors from './sections/ExperimentFactors.vue'
import Citation from './sections/Citation.vue'
import DemoLibero from './sections/DemoLibero.vue'
import DemoReal from './sections/DemoReal.vue'
import Video from './sections/Video.vue'
import ExperimentAttention from './sections/ExperimentAttention.vue'

export default {
  components: {
    Title,
    Abstract,
    Motivation,
    Method,
    ExperimentLibero,
    ExperimentReal,
    // ExperimentFactors,
    Citation,
    DemoLibero,
    DemoReal,
    Video,
    ExperimentAttention,
  }
}
</script>

<template>
  <Title/>
  <Video/>
  <DemoReal/>
  <DemoLibero/>
  <Abstract/>
  <Motivation/>
  <Method/>
  <ExperimentLibero/>
  <ExperimentReal/>
  <!-- <ExperimentFactors/> -->
  <ExperimentAttention/>
  <Citation/>
</template>