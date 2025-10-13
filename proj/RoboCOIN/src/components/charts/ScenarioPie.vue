<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw } from 'vue';
import * as echarts from 'echarts';

// 图表容器和实例
const chartContainer = ref(null);
let chart = null;

// 外层大类数据
const outerData = [
  { name: 'Residential', value: 48.1, children: [
    { name: 'Home', value:  47.6 },
    { name: 'Living-room', value: 0.5 },
  ]},
  { name: 'Commercial', value: 39.6, children: [
    { name: 'Kitchen', value: 18.6 },
    { name: 'Restaurant', value: 17.4 },
    { name: 'Cafe', value: 3.6 }
  ]},
  { name: 'Working', value: 12.3, children: [
    { name: 'Office', value: 6.3 },
    { name: 'School', value: 3.0 },
    { name: 'Hospital', value: 3.0 }
  ]}
];

// 当前选中类型和索引
const currentSelected = ref('Residential');
let currentIndex = 0;
let autoSwitchTimer = null;
const switchInterval = 3000; // 3秒切换一次

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = markRaw(echarts.init(chartContainer.value));
  
  // 配置选项
  const option = {
    title: {
      text: currentSelected.value,
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: true,
      orient: 'vertical',
      left: 'left',
      data: outerData.map(item => item.name)
    },
    series: [
      {
        name: 'Type',
        type: 'pie',
        selectedMode: 'single',
        radius: ['40%', '55%'],
        label: {
          show: false,
          formatter: '{b}\n{c} ({d}%)',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: false,
          }
        },
        data: outerData,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      {
        name: 'Name',
        type: 'pie',
        radius: ['65%', '80%'],
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 16
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 20
        },
        data: [],
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ]
  };

  chart.setOption(option);
  
  // 添加点击事件监听
  chart.on('click', (params) => {
    if (params.seriesIndex === 0) {
      handleCategoryClick(params.dataIndex);
    }
  });

  // 鼠标悬停时暂停自动切换[2](@ref)
  chart.on('mouseover', () => {
    stopAutoSwitch();
  });

  // 鼠标移出时恢复自动切换[2](@ref)
  chart.on('mouseout', () => {
    startAutoSwitch();
  });

  // 默认显示第一个大类的子类
  if (outerData.length > 0) {
    switchToCategory(0);
  }

  // 启动自动切换
  startAutoSwitch();
};

// 处理分类点击
const handleCategoryClick = (index) => {
  stopAutoSwitch();
  switchToCategory(index);
};

// 切换到指定分类
const switchToCategory = (index) => {
  if (index < 0 || index >= outerData.length) return;
  
  const clickedCategory = outerData[index];
  currentSelected.value = clickedCategory.name;
  currentIndex = index;
  
  // 更新内层饼图数据[8](@ref)
  const innerData = clickedCategory.children || [];
  
  // 使用setOption更新图表配置[8](@ref)
  chart.setOption({
    series: [
      {}, // 外层饼图保持不变
      { data: innerData } // 更新内层饼图数据
    ],
    title: {
      text: currentSelected.value
    }
  });
  
  // 高亮显示当前选中的大类[8](@ref)
  chart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: index
  });
};

// 切换到下一个分类
const switchToNextCategory = () => {
  const nextIndex = (currentIndex + 1) % outerData.length;
  switchToCategory(nextIndex);
};

// 启动自动切换[6](@ref)
const startAutoSwitch = () => {
  stopAutoSwitch(); // 确保没有重复的定时器
  
  autoSwitchTimer = setInterval(() => {
    switchToNextCategory();
  }, switchInterval);
};

// 停止自动切换
const stopAutoSwitch = () => {
  if (autoSwitchTimer) {
    clearInterval(autoSwitchTimer);
    autoSwitchTimer = null;
  }
};

// 响应窗口大小变化
const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

// 页面可见性变化处理[2](@ref)
const handleVisibilityChange = () => {
  if (document.hidden) {
    stopAutoSwitch();
  } else {
    startAutoSwitch();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  // 清理资源[4](@ref)
  stopAutoSwitch();
  if (chart) {
    chart.dispose();
  }
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>