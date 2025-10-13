<template>
  <div ref="chartContainer" style="width: 100%; height: 250px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);
let chart = null;

// 原始数据
const actionData = {
  low: [
    { name: 'approach', value: 45 },
    { name: 'grasp', value: 38 },
    { name: 'place', value: 52 },
    { name: 'release', value: 29 },
    { name: 'press', value: 41 },
    { name: 'pull', value: 35 },
    { name: 'push', value: 31 },
    { name: 'lift', value: 28 },
    { name: 'carry', value: 24 },
    { name: 'move', value: 22 },
    { name: 'follow', value: 20 },
    { name: 'watch', value: 18 },
    { name: 'approach', value: 45 },
    { name: 'grasp', value: 38 },
    { name: 'place', value: 52 },
    { name: 'release', value: 29 },
    { name: 'press', value: 41 },
    { name: 'pull', value: 35 },
    { name: 'push', value: 31 },
    { name: 'lift', value: 28 },
    { name: 'carry', value: 24 },
  ],
  high: [
    { name: 'handover', value: 68 },
    { name: 'coordinate', value: 72 },
    { name: 'assist', value: 63 },
    { name: 'guide', value: 55 },
    { name: 'negotiate', value: 38 },
    { name: 'share', value: 36 },
    { name: 'support', value: 33 },
    { name: 'handover', value: 68 },
    { name: 'coordinate', value: 72 },
    { name: 'assist', value: 63 },
    { name: 'guide', value: 55 },
    { name: 'negotiate', value: 38 },
    { name: 'share', value: 36 },
    { name: 'support', value: 33 }
  ]
};

// 处理数据：分别按值降序排序，并提取名称和数值数组
const processData = () => {
  const sortedLow = [...actionData.low].sort((a, b) => b.value - a.value);
  const sortedHigh = [...actionData.high].sort((a, b) => b.value - a.value);
  
  return {
    lowCategories: sortedLow.map(item => item.name),
    lowValues: sortedLow.map(item => item.value),
    highCategories: sortedHigh.map(item => item.name),
    highValues: sortedHigh.map(item => item.value)
  };
};

const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = markRaw(echarts.init(chartContainer.value));
  const { lowCategories, lowValues, highCategories, highValues } = processData();

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
        right: '50%', // 左侧图表占据约一半少一点的空间，为中间留出间隙
        top: '20%',
        bottom: '10%',
        containLabel: true
      },
      { // 右侧网格（高协作图表）
        left: '51%', // 从中间偏右开始
        right: '0%',
        top: '20%',
        bottom: '10%',
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
      }
    ],
    xAxis: [
      { // 左侧y轴（低协作动作名称）
        type: 'category',
        gridIndex: 0,
        name: 'Low Collaboration',
        nameLocation: 'middle',
        nameGap: 70,
        data: lowCategories,
        axisLabel: { color: '#ffa586', rotate: 90 },
      },
      { // 右侧y轴（高协作动作名称）
        type: 'category',
        gridIndex: 1,
        name: 'High Collaboration',
        nameLocation: 'middle',
        nameGap: 70,
        data: highCategories,
        axisLabel: { color: '#e47869', rotate: 90 },
      }
    ],
    series: [
      {
        name: 'Low Collaboration',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: lowValues,
        itemStyle: { color: '#ffa586' },
      },
      {
        name: 'High Collaboration',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: highValues,
        itemStyle: { color: '#e47869' },
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