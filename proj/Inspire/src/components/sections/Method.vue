<script setup>
import method from '../mds/method.mdx';
</script>

<template>
  <div v-animate-onscroll="'animated fadeInUp'">
    <el-divider />

    <el-row justify="center">
        <el-col :xs="28" :sm="24" :md="20" :lg="16" :xl="12">
          <h1>Method</h1>
            <div class="caption-box">
                <el-image src="./method.png" class="caption-img" fit="cover" />
                <method class="caption-text" />
            </div>
        </el-col>
    </el-row>

  </div>
</template>

<style scoped>

.caption-img {
    margin: 20px 0;
}

</style>