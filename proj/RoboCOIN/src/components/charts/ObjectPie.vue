<template>
  <div ref="chartContainer" style="width: 100%; height: 250px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);
let chart = null;

// 原始数据
const objectData = {
  rigid: [
    { name: 'bowl', value: 20 },
    { name: 'box', value: 15 },
    { name: 'cup', value: 10 },
    { name: 'plate', value: 8 },
    { name: 'bottle', value: 5 },
    { name: 'can', value: 4 },
  ],
  hinge: [
    { name: 'door', value: 12 },
    { name: 'cabine', value: 9 },
    { name: 'drawer', value: 7 },
    { name: 'laptop', value: 6 },
    { name: 'micro', value: 5 },
    { name: 'oven', value: 4 },
  ],
  deformable: [
    { name: 'ball', value: 20 },
    { name: 'blob', value: 15 },
    { name: 'tube', value: 10 },
    { name: 'sheet', value: 8 },
    { name: 'bag', value: 5 },
    { name: 'pillow', value: 4 },
  ]
};

// 处理数据：分别按值降序排序，并提取名称和数值数组
const processData = () => {
  const sortedRigid = [...objectData.rigid].sort((a, b) => b.value - a.value);
  const sortedHinge = [...objectData.hinge].sort((a, b) => b.value - a.value);
  const sortedDeformable = [...objectData.deformable].sort((a, b) => b.value - a.value);

  return {
    rigidCategories: sortedRigid.map(item => item.name),
    rigidValues: sortedRigid.map(item => item.value),
    hingeCategories: sortedHinge.map(item => item.name),
    hingeValues: sortedHinge.map(item => item.value),
    deformableCategories: sortedDeformable.map(item => item.name),
    deformableValues: sortedDeformable.map(item => item.value)
  };
};

const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = markRaw(echarts.init(chartContainer.value));
  const { rigidCategories, rigidValues, hingeCategories, hingeValues, deformableCategories, deformableValues } = processData();

  const option = {
    title: {
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    // 关键配置：定义左右两个图表区域
    grid: [
      { // 左侧网格（低协作图表）
        left: '0%',
        right: '66%', // 左侧图表占据约一半少一点的空间，为中间留出间隙
        top: '20%',
        bottom: '20%',
        containLabel: true
      },
      {
        left: '34%',
        right: '34%',
        top: '20%',
        bottom: '20%',
        containLabel: true
      },
      {
        left: '67%',
        right: '0%',
        top: '20%',
        bottom: '20%',
        containLabel: true
      }
    ],
    yAxis: [
      { // 左侧x轴
        type: 'value',
        gridIndex: 0, // 关联到第一个grid
        position: 'bottom'
      },
      { // 右侧x轴
        type: 'value',
        gridIndex: 1, // 关联到第二个grid
        position: 'bottom'
      },
      { // 右侧x轴
        type: 'value',
        gridIndex: 2, // 关联到第二个grid
        position: 'bottom'
      }
    ],
    xAxis: [
      { // 左侧y轴（低协作动作名称）
        type: 'category',
        gridIndex: 0,
        name: 'Rigid Objects',
        nameLocation: 'middle',
        nameGap: 60,
        data: rigidCategories,
        axisLabel: { color: '#9edfa0', rotate: 90 },
      },
      { // 右侧y轴（高协作动作名称）
        type: 'category',
        gridIndex: 1,
        name: 'Hinged Objects',
        nameLocation: 'middle',
        nameGap: 60,
        data: hingeCategories,
        axisLabel: { color: '#91cc75', rotate: 90 },
      },
      { // 右侧y轴（高协作动作名称）
        type: 'category',
        gridIndex: 2,
        name: 'Deformable Objects',
        nameLocation: 'middle',
        nameGap: 60,
        data: deformableCategories,
        axisLabel: { color: '#70965e', rotate: 90 },
      }
    ],
    series: [
      {
        name: 'Rigid',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: rigidValues,
        itemStyle: { color: '#9edfa0' },
      },
      {
        name: 'Hinged',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: hingeValues,
        itemStyle: { color: '#91cc75' },
      },
      {
        name: 'Deformable',
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: deformableValues,
        itemStyle: { color: '#70965e' },
      }
    ]
  };

  chart.setOption(option);
};

const handleResize = () => {
  if (chart) chart.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (chart) chart.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>