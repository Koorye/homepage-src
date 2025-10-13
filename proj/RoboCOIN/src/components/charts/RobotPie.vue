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
  { name: 'Dual', value: 34.7, children: [
    { name: 'Agilex COBOT MAGIC', value:  26.6 },
    { name: 'Galaxea R1 Lite', value: 7.7 },
    { name: 'FutureWei ADora', value: 0.4 }
  ]},
  { name: 'Half-Humanoid', value: 44.5, children: [
    { name: 'Galbot G1', value: 11.5 },
    { name: 'Tianqing A2', value: 10.3 },
    { name: 'Realman AIDA-L', value: 8.7 },
    { name: 'AI2 AlphaBot 2', value: 12.4 },
    { name: 'AIRBOT MMK2', value: 1.6 }
  ]},
  { name: 'Humanoid', value: 20.8, children: [
    { name: 'Leju Kuavo 4 Pro', value: 17.7 },
    { name: 'Unitree G1edu', value: 3.0 }
  ]}
];

// 当前选中类型
const currentSelected = ref('Dual');
// 定时器引用
let autoSwitchTimer = null;
// 当前高亮索引
let currentHighlightIndex = 0;
// 切换间隔（毫秒）
const switchInterval = 3000;

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

  // 鼠标悬停时暂停自动切换[3,4](@ref)
  chart.on('mouseover', () => {
    stopAutoSwitch();
  });

  // 鼠标移出时恢复自动切换[3,4](@ref)
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
  // 可选：点击后可以重新启动定时器，或者保持手动选择状态
  // startAutoSwitch();
};

// 切换到指定分类
const switchToCategory = (index) => {
  if (index < 0 || index >= outerData.length) return;
  
  const clickedCategory = outerData[index];
  currentSelected.value = clickedCategory.name;
  currentHighlightIndex = index;
  
  // 更新内层饼图数据
  const innerData = clickedCategory.children || [];
  
  // 更新图表配置[7](@ref)
  const currentOption = chart.getOption();
  currentOption.series[1].data = innerData;
  currentOption.title[0].text = currentSelected.value;
  chart.setOption(currentOption);
  
  // 高亮显示当前选中的大类[1,4](@ref)
  chart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: index
  });
};

// 切换到下一个分类[1,8](@ref)
const switchToNextCategory = () => {
  const nextIndex = (currentHighlightIndex + 1) % outerData.length;
  switchToCategory(nextIndex);
};

// 启动自动切换[1,5](@ref)
const startAutoSwitch = () => {
  stopAutoSwitch(); // 确保没有重复的定时器
  
  autoSwitchTimer = setInterval(() => {
    switchToNextCategory();
  }, switchInterval);
};

// 停止自动切换[3,4](@ref)
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

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 清理资源[4](@ref)
  stopAutoSwitch();
  if (chart) {
    chart.dispose();
  }
  window.removeEventListener('resize', handleResize);
});
</script>