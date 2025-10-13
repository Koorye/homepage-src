<template>
  <div class="dataset-table-container">
    <h2>Comparison of Robot Datasets</h2>
    <div class="table-wrapper">
      <table class="dataset-table">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" :class="header.class">
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in datasetRows" :key="row.dataset" 
              :class="{
                'highlight-row': row.highlight,
                'gray-text': row.gray
              }">
            <td class="dataset-name">{{ row.dataset }}</td>
            <td>{{ row.arm }}</td>
            <td>{{ row.embodiment }}</td>
            <td>{{ row.trajectory }}</td>
            <td>{{ row.task }}</td>
            <td>{{ row.skill }}</td>
            <td>{{ row.dexterous ? '✓' : '✗' }}</td>
            <td>{{ row.annotation }}</td>
            <td>{{ row.collection }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatasetTable',
  data() {
    return {
      headers: [
        { key: 'dataset', text: 'Dataset', class: 'dataset-header' },
        { key: 'arm', text: 'Arm', class: 'arm-header' },
        { key: 'embodiment', text: 'Embodiment', class: 'embodiment-header' },
        { key: 'trajectory', text: 'Trajectory', class: 'trajectory-header' },
        { key: 'task', text: 'Task', class: 'task-header' },
        { key: 'skill', text: 'Skill', class: 'skill-header' },
        { key: 'dexterous', text: 'Dexterous', class: 'dexterous-header' },
        { key: 'annotation', text: 'Annotation', class: 'annotation-header' },
        { key: 'collection', text: 'Collection', class: 'collection-header' }
      ],
      datasetRows: [
        {
          dataset: 'Pinto and Gupta',
          arm: 'Dual',
          embodiment: 1,
          trajectory: '50k',
          task: 'n/a',
          skill: 1,
          dexterous: false,
          annotation: 'No',
          collection: 'Scripted',
          highlight: false,
          gray: false
        },
        {
          dataset: 'RoboNet',
          arm: 'Single',
          embodiment: 1,
          trajectory: '162k',
          task: 'n/a',
          skill: 'n/a',
          dexterous: false,
          annotation: 'No',
          collection: 'Scripted',
          highlight: false,
          gray: false
        },
        {
          dataset: 'MT-Opt',
          arm: 'Single',
          embodiment: 1,
          trajectory: '800k',
          task: 12,
          skill: 1,
          dexterous: false,
          annotation: 'No',
          collection: 'Scripted',
          highlight: false,
          gray: false
        },
        {
          dataset: 'BridgeData',
          arm: 'Single',
          embodiment: 1,
          trajectory: '7.2k',
          task: 71,
          skill: 4,
          dexterous: false,
          annotation: 'No',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'BC-Z',
          arm: 'Single',
          embodiment: 1,
          trajectory: '26k',
          task: 100,
          skill: 3,
          dexterous: false,
          annotation: 'No',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'RH20T',
          arm: 'Single',
          embodiment: 1,
          trajectory: '13k',
          task: 140,
          skill: 33,
          dexterous: false,
          annotation: 'No',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'RoboSet',
          arm: 'Single',
          embodiment: 1,
          trajectory: '98k',
          task: 38,
          skill: 6,
          dexterous: false,
          annotation: 'No',
          collection: '30% Human / 70% Scripted',
          highlight: false,
          gray: false
        },
        {
          dataset: 'BridgeData V2',
          arm: 'Single',
          embodiment: 1,
          trajectory: '60k',
          task: 'n/a',
          skill: 13,
          dexterous: false,
          annotation: 'No',
          collection: '85% Human / 15% Scripted',
          highlight: false,
          gray: false
        },
        {
          dataset: 'DROID',
          arm: 'Single',
          embodiment: 1,
          trajectory: '76k',
          task: 'n/a',
          skill: 86,
          dexterous: false,
          annotation: 'No',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'Open X-Embodiment',
          arm: 'Single+Dual',
          embodiment: 22,
          trajectory: '1.4M',
          task: '160k',
          skill: 217,
          dexterous: false,
          annotation: 'No',
          collection: 'Dataset Aggregation',
          highlight: false,
          gray: true
        },
        {
          dataset: 'RoboMIND',
          arm: 'Single+Dual',
          embodiment: 4,
          trajectory: '107k',
          task: 479,
          skill: 38,
          dexterous: true,
          annotation: 'Flat',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'AgiBot World Beta',
          arm: 'Dual',
          embodiment: 1,
          trajectory: '1M',
          task: 'n/a',
          skill: 'n/a',
          dexterous: false,
          annotation: 'Flat',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'Open Galaxea',
          arm: 'Dual',
          embodiment: 1,
          trajectory: '50k',
          task: 'n/a',
          skill: 'n/a',
          dexterous: true,
          annotation: 'Flat',
          collection: 'Human Teleoperation',
          highlight: false,
          gray: false
        },
        {
          dataset: 'RoboCOIN (Ours)',
          arm: 'Dual',
          embodiment: 16,
          trajectory: '200k+',
          task: '1k+',
          skill: '50+',
          dexterous: true,
          annotation: 'Hierarchical',
          collection: 'Human Teleoperation',
          highlight: true,
          gray: false
        }
      ]
    }
  }
}
</script>

<style scoped>
.dataset-table-container {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dataset-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1000px;
}

.dataset-table th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
}

.dataset-table td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.dataset-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* 特殊行样式 */
.highlight-row {
  background-color: #ffebee !important; /* 红色高亮背景 */
  font-weight: 600;
}

.highlight-row:hover {
  background-color: #ffcdd2 !important;
}

.gray-text {
  color: #757575; /* 灰色文本 */
}

.dataset-name {
  text-align: left;
  font-weight: 500;
  padding-left: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dataset-table {
    font-size: 13px;
  }
  
  .dataset-table th,
  .dataset-table td {
    padding: 8px 6px;
  }
}

@media (max-width: 768px) {
  .dataset-table-container {
    padding: 1rem;
  }
  
  h2 {
    font-size: 1.3rem;
  }
  
  .dataset-table {
    font-size: 12px;
    min-width: 800px;
  }
}

/* 符号样式 */
.dataset-table td:contains("✓") {
  color: #4caf50; /* 绿色勾号 */
  font-weight: bold;
}

.dataset-table td:contains("✗") {
  color: #f44336; /* 红色叉号 */
}
</style>