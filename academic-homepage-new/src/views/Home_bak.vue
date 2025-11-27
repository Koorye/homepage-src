<template>
  <div class="home-container">
    <!-- 左侧固定导航栏 -->
    <aside class="sidebar">
      <div class="profile-section">
        <img class="avatar" src="../assets/profile.png" alt="Profile Picture" />
        <h1 class="name">Shihan Wu</h1>
        <p class="location">shihan.wu.koorye@outlook.com</p>
      </div>
      
      <nav class="navigation">
        <ul>
          <li 
            v-for="section in sections" 
            :key="section.id"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </li>
        </ul>
      </nav>
      <!-- 修改后的 contact-info 部分 -->
      <div class="contact-info">
        <p class="contact-title">Find me on:</p>
        <div class="contact-links">
          <a href="https://github.com/Koorye" target="_blank" class="contact-link" title="GitHub">
            <img src="../assets/icons/github.svg" alt="GitHub" class="contact-icon" />
            <span class="contact-text">GitHub</span>
          </a>
          <a href="https://koorye.github.io/blog" target="_blank" class="contact-link" title="Blog">
            <img src="../assets/icons/blog.svg" alt="Blog" class="contact-icon" />
            <span class="contact-text">Blog</span>
          </a>
          <a href="https://scholar.google.com/citations?user=7VCaV5EAAAAJ&hl=zh-CN" target="_blank" class="contact-link" title="Google Scholar">
            <img src="../assets/icons/google-scholar.svg" alt="Google Scholar" class="contact-icon" />
            <span class="contact-text">GS</span>
          </a>
          <a href="https://dblp.org/pid/132/9517-1" target="_blank" class="contact-link" title="DBLP">
            <img src="../assets/icons/dblp.svg" alt="DBLP" class="contact-icon" />
            <span class="contact-text">DBLP</span>
          </a>
        </div>
        <p class="contact-desc">© 2025 Shihan Wu. All rights reserved.</p>
      </div>
    </aside>
    
    <!-- 右侧可滚动内容区域 -->
    <main class="content">
      <div class="banner-container">
        <img src="../assets/banner.jpg" alt="Banner" class="banner" />
      </div>
      <p class="banner-caption">↑ This is Zhongguancun Science & Technology Park in Beijing where I interned in summer 2025 ↑</p>
      <div class="content-wrapper">
        <header class="content-header">
          <h1>SHIHAN <span class="highlight-blue-bold">WU</span></h1>
          <h3 class="highlight-blue-bold">shihan.wu.koorye@outlook.com</h3>
        </header>
        
        <section id="introduction" class="section" ref="introduction">
            <p>Hello! I am a master student at <a href="https://www.scse.uestc.edu.cn/" target="_blank" class="highlight-link">School of Computer Science and Engineering</a> at <a href="https://www.uestc.edu.cn/" target="_blank" class="highlight-link">University of Electronic Science and Technology of China (UESTC)</a>.</p>
            <p>My research interests include <span class="highlight-red">Embodied AI</span> and <span class="highlight-red">Vision-Language Models</span>.</p>
            <p>Feel free to reach out to me via email for any inquiries or collaborations!</p>
        </section>

        <section id="experience" class="section" ref="experience">
          <h2>Experience</h2>
          <div class="timeline">
            <div 
              v-for="(exp, index) in experiences" 
              :key="index" 
              class="timeline-item"
            >
              <div class="timeline-marker">
                <img :src="exp.logo" :alt="exp.organization" class="logo" />
                <div class="timeline-line" v-if="index < experiences.length - 1"></div>
              </div>
              <div class="timeline-content">
                <h3>{{ exp.title }} - <a v-if="exp.link" :href="exp.link" target="_blank" class="highlight-link">{{ exp.organization }}</a><span v-else>{{ exp.organization }}</span> <span class="timeline-date">{{ exp.date }}</span></h3>
                <p>{{ exp.description }}</p>
                <div v-if="exp.details" class="exp-details">
                  <div v-for="(detail, detailIndex) in exp.details" :key="detailIndex" class="p-close">
                    <span v-if="detail.label" class="highlight-red">{{ detail.label }}:</span> {{ detail.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 新增 News 板块 -->
        <section id="news" class="section" ref="news">
          <h2>News</h2>
          <div class="news-timeline">
            <div 
              v-for="(item, index) in newsList" 
              :key="index" 
              class="news-item"
            >
              <div class="news-date">{{ item.date }}</div>
              <div class="news-content">
                <p v-html="item.content"></p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="publications" class="section" ref="publication">
          <h2>Publications</h2>
          <div class="publication-list">
            <div 
              v-for="(pub, index) in publications" 
              :key="index" 
              class="publication-item"
              @click="togglePublication(index)"
            >
              <!-- 标题+日期 放在顶部通栏 -->
              <div class="pub-header">
                <h3 v-html="pub.title"></h3>
                <span class="pub-date">{{ pub.date }}</span>
              </div>
              <!-- 下方：图片 + 描述+标签+链接 -->
              <div class="pub-body">
                <div class="publication-image">
                  <img :src="pub.image" :alt="pub.title" />
                </div>
                <div class="publication-content">
                  <p v-html="pub.description"></p>
                  <div class="pub-tags">
                    <span v-for="tag in pub.tags" :key="tag" class="keyword-tag">{{ tag }}</span>
                  </div>
                  <div v-if="pub.links" class="pub-links">
                    <a 
                      v-for="(link, key) in pub.links" 
                      :key="key" 
                      :href="link" 
                      target="_blank" 
                      class="pub-link-btn"
                    >
                      <span class="link-icon" v-html="getIcon(key)"></span> 
                      {{ formatLinkText(key) }}
                      <!-- 新增：Code链接显示Star数 -->
                      <span v-if="key === 'code'" class="star-count">
                        <span v-if="starCounts[getRepoKey(link)] === 'loading'">
                          <i class="fas fa-spinner fa-spin"></i>
                        </span>
                        <span v-else-if="starCounts[getRepoKey(link)] === 'error'">
                          <i class="fas fa-exclamation-circle"></i>
                        </span>
                        <span v-else-if="starCounts[getRepoKey(link)]">
                          <i class="fas fa-star"></i> {{ starCounts[getRepoKey(link)] }}
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <!-- 新增：详细内容区域 - 占据100%宽度 -->
              <div class="pub-details" :class="{ 'show-details': expandedIndex === index }">
                <div class="detail-section">
                  <h4>Abstract</h4>
                  <p v-html="pub.abstract"></p>
                </div>
                <div class="detail-section">
                  <h4>Key Contributions</h4>
                  <ul>
                    <li v-for="(contrib, i) in (pub.contributions)">
                      <p v-html="contrib"></p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="click-tip">Click for more details</div>
            </div>
          </div>
        </section>

        <section id="awards" class="section" ref="award">
          <h2>Awards</h2>
          <div class="awards-grid">
            <div 
              v-for="(award, index) in awards" 
              :key="index" 
              class="award-item"
            >
              <div class="award-icon">{{ award.icon }}</div>
              <div class="award-content">
                <h3>{{ award.title }}</h3>
                <p>{{ award.issuer }} - {{ award.year }}</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="skills" class="section" ref="skill">
          <h2>Skills</h2>
          <div class="skills-container">
            <div 
              v-for="(skillGroup, index) in skillGroups" 
              :key="index" 
              class="skill-category"
            >
              <h3>{{ skillGroup.category }}</h3>
              <div class="skills-list">
                <div 
                  v-for="(skill, skillIndex) in skillGroup.skills" 
                  :key="skillIndex" 
                  class="skill-item"
                >
                  <div class="skill-info">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-level">{{ skill.level }}%</span>
                  </div>
                  <div class="skill-bar">
                    <div 
                      class="skill-progress" 
                      :style="{ width: skill.level + '%' }"
                      :class="getSkillLevelClass(skill.level)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 新增 Gallery 板块 - 使用 Vue Swiper -->
        <section id="gallery" class="section" ref="gallery">
          <h2>Gallery</h2>
          <div class="gallery-container">
            <swiper 
              :modules="modules"
              :slides-per-view="3"
              :navigation="false"
              :effect="'coverflow'"
              :autoplay="{ delay: 3000 }"
              :coverflowEffect="{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
              }"
              :loop="true"
              class="my-swiper"
            >
              <swiper-slide 
                v-for="(photo, index) in galleryPhotos" 
                :key="index"
                class="swiper-slide-custom"
              >
                <div class="gallery-slide-content">
                  <img 
                    :src="photo.image" 
                    :alt="photo.title" 
                    class="gallery-image"
                    loading="lazy"
                  />
                  <div class="gallery-caption">
                    <h3>{{ photo.title }}</h3>
                    <div class="photo-desc">{{ photo.description }}</div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
// 导入 Swiper 组件和模块
import { Swiper, SwiperSlide } from 'swiper/vue';
import { 
  Navigation, 
  Pagination, 
  Scrollbar, 
  A11y, 
  EffectCoverflow,
  Autoplay 
} from 'swiper/modules';

// 导入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';

// 导航章节列表 - 新增 GALLERY 项
const sections = [
  { id: 'introduction', title: 'INTRODUCTION' },
  { id: 'experience', title: 'EXPERIENCE' },
  { id: 'news', title: 'NEWS' },
  { id: 'publications', title: 'PUBLICATIONS' },
  { id: 'awards', title: 'AWARDS' },
  { id: 'skills', title: 'SKILLS' },
  { id: 'gallery', title: 'GALLERY' }, // 新增
];

// 章节引用 - 新增 gallery 引用
const introduction = ref(null);
const experience = ref(null);
const news = ref(null);
const publication = ref(null);
const award = ref(null);
const skill = ref(null);
const gallery = ref(null); // 新增

// Swiper 模块配置
const modules = [Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay];

// 新增 Gallery 数据
const galleryPhotos = ref([
  {
    image: new URL('../assets/gallery/2025-09-01.jpg', import.meta.url).href,
    title: 'BAAI Internship',
    description: 'At Beijing Academy of Artificial Intelligence (BAAI) during summer 2025',
  },
  {
    image: new URL('../assets/gallery/2025-09-23.jpg', import.meta.url).href,
    title: 'Miaoying Temple',
    description: 'A cat resting peacefully at Miaoying Temple, Beijing, Sep. 2025',
  },
  {
    image: new URL('../assets/gallery/2025-10-02-1.jpg', import.meta.url).href,
    title: 'Bee on Sunflower',
    description: 'A bee collecting nectar from a sunflower, Beijing, Oct. 2025',
  },
  {
    image: new URL('../assets/gallery/2025-10-02-2.jpg', import.meta.url).href,
    title: 'Sunflower Field',
    description: 'A vast field of sunflowers at dusk, Beijing, Oct. 2025',
  },
  {
    image: new URL('../assets/gallery/2025-10-07.jpg', import.meta.url).href,
    title: 'Bee on Flower',
    description: 'A bee resting on white flowers, Beijing, Oct. 2025',
  },
  {
    image: new URL('../assets/gallery/2025-10-19.jpg', import.meta.url).href,
    title: 'Hummingbird Hawk-moth',
    description: 'It looks like a hummingbird but is actually a moth! Captured in Beijing, Oct. 2025',
  },
  {
    image: new URL('../assets/gallery/2025-10-29.jpg', import.meta.url).href,
    title: '"Chestnut" Cat',
    description: 'The cat named "Chestnut" at my dormitory, Chengdu, Oct. 2025',
  },
  {
    image: new URL('../assets/gallery/2025-11-02.jpg', import.meta.url).href,
    title: 'Axolotl',
    description: 'My lovely axolotl at home, Chengdu, Nov. 2025',
  }
]);

// 经历数据（不变）
const experiences = ref([
  {
    title: 'Research Intern',
    organization: 'BAAI',
    link: 'https://www.baai.ac.cn/',
    date: '2025',
    logo: new URL('../assets/icons/baai.png', import.meta.url).href,
    description: 'Exploring efficient learning paradigms of VLA, designing large-scale bimanual dataset with hierarchical skill labels',
  },
  {
    title: 'Master of Computer Science and Technology',
    organization: 'UESTC',
    link: 'https://www.uestc.edu.cn',
    date: '2023-Present',
    logo: new URL('../assets/icons/uestc.png', import.meta.url).href,
    description: '',
    details: [
      { label: 'Rank', text: '6/454 (Top 1.3%)' },
      { label: 'Research Focus', text: 'Embodied AI, Vision-Language Models' },
      { label: 'Award', text: 'National Scholarship (2024), Outstanding Graduate of Sichuan Province (2025)' }
    ]
  },
  {
    title: 'Bachelor of Computer Science and Technology',
    organization: 'UESTC',
    link: 'https://www.uestc.edu.cn',
    date: '2019-2023',
    logo: new URL('../assets/icons/uestc.png', import.meta.url).href,
    description: '',
    details: [
      { label: 'Rank', text: '18/181 (Top 10%)' },
      { label: 'Award', text: 'Outstanding Graduate of UESTC (2023), "Shiqiang" Special Scholarship (2022)' }
    ]
  }
]);

// 新增 News 数据
const newsList = ref([
  {
    date: 'Nov. 2025',
    content: 'Our <span class="highlight-red">RoboCOIN</span> dataset has total downloads of <span class="highlight-red">60,000</span>!'
  },
  {
    date: 'Nov. 2025',
    content: 'I have exceeded <span class="highlight-red">100 citations</span> on Google Scholar!'
  }
]);

// 新增：用于跟踪展开的卡片索引
const expandedIndex = ref(-1);

// 修改：切换卡片展开/收起的方法
const togglePublication = (index) => {
  // 如果点击的是当前展开的卡片，则收起；否则展开新的卡片
  expandedIndex.value = expandedIndex.value === index ? -1 : index;
};

// 出版物数据 - 新增 links 字段
const publications = ref([
  {
    title: 'RoboCOIN: An Open-Sourced Bimanual Robotic Data COllection for INtegrated Manipulation',
    date: 'Nov. 2025',
    image: new URL('../assets/publications/robocoin.png', import.meta.url).href,
    description: 'Open-sourced large-scale bimanual robotic dataset with <span class="highlight-red">15 robotic platforms</span> and <span class="highlight-red">180K+ demonstrations</span>, collaborated with <span class="highlight-red">20 institutions</span>',
    tags: ['Robotics', 'Dataset'],
    links: { // 新增链接
      project: 'https://flagopen.github.io/RoboCOIN/',
      arxiv: 'https://arxiv.org/abs/2511.17441',
      pdf: 'https://arxiv.org/pdf/2511.17441',
      code: 'https://github.com/FlagOpen/RoboCOIN/'
    },
    abstract: 'Bimanual manipulation is essential for achieving human-like dexterity in robots, but the large-scale and diverse bimanual robot datasets remain scarce due to hardware heterogeneity across robotic platforms. To address the challenge, we present RoboCOIN, a comprehensive multi-embodiment bimanual manipulation dataset with over <span class="highlight-red">180,000 demonstrations</span> collected from <span class="highlight-red">15 distinct robotic platforms</span>. The dataset covers <span class="highlight-red">16 scenarios</span>, including residential, commercial, and working environments, with <span class="highlight-red">421 tasks</span> systematically organized by bimanual coordination patterns and object properties. Our key innovation is a hierarchical capability pyramid that provides multi-level annotations, spanning trajectory-level concepts, segment-level subtasks, and frame-level kinematics. We further develop CoRobot, a comprehensive processing framework featuring Robot Trajectory Markup Language (RTML) for quality assessment, automated annotation generation, and unified multi-embodiment management. Extensive experiments demonstrate the reliability and effectiveness of RoboCOIN in multi-embodiment bimanual learning, with significant performance improvements across various model architectures and robotic platforms. The complete dataset and framework are open-sourced and publicly available for further research purposes.',
    contributions: [
      '<span class="highlight-red">Large-Scale, Multi-Embodiment Bimanual Dataset.</span> We introduce RoboCOIN, a comprehensive dataset featuring over 180,000 demonstrations across 421 tasks, collected from 15 distinct robotic platforms.',
      '<span class="highlight-red">Hierarchical Capability Pyramid.</span> We propose a hierarchical capability pyramid with trajectory-level, segmentlevel, and frame-level descriptions, enabling multiresolution learning from high-level global concepts to low-level control.',
      '<span class="highlight-red">Integrated Data Processing Framework.</span> We develop a unified data processing framework named CoRobot, including RTML-based assessment, an automated annotation toolchain, and a platform for unified multiembodiment dataset management and robot deployment.'
    ]
  },
  {
    title: 'Policy Contrastive Decoding for Robotic Foundation Models',
    date: 'Sep. 2025',
    image: new URL('../assets/publications/pcd.png', import.meta.url).href,
    description: 'Universal framework for multiple VLA architectures, achieving <span class="highlight-red">+8%~41%</span> improvement without training',
    tags: ['Robotics', 'Vision-Language-Action Models', 'Test-Time'],
    links: { // 新增链接
      project: 'https://koorye.github.io/proj/PCD',
      arxiv: 'https://arxiv.org/abs/2505.13255',
      pdf: 'https://arxiv.org/pdf/2505.13255',
      code: 'https://github.com/Koorye/PCD/'
    },
    abstract: 'Robotic foundation models, or generalist robot policies, hold immense potential to enable flexible, general-purpose and dexterous robotic systems. Despite their advancements, our empirical experiments reveal that existing robot policies are prone to learning spurious correlations from pre-training trajectories, adversely affecting their generalization capabilities beyond the training data. To tackle this, we propose a novel Policy Contrastive Decoding (PCD) approach, which redirects the robot policy’s focus toward object-relevant visual clues by contrasting action probability distributions derived from original and object-masked visual inputs. As a training-free method, our PCD can be used as a plugin to improve different types of robot policies without needing to finetune or access model weights. We conduct extensive experiments on top of three open-source robot policies, including the autoregressive policy OpenVLA and the diffusion-based policies Octo and π0. The obtained results in both simulation and real-world environments prove PCD’s flexibility and effectiveness, e.g., PCD enhances the state-of-the-art policy π0 by <span class="highlight-red">8%</span> in the simulation environment and by <span class="highlight-red">108%</span> in the real-world environment.',
    contributions: [
      'We propose PCD, a simple, training-free, and easy-to-implement scheme to tackle the spurious correlation issue in robot policies.',
      'PCD can be used as a plugin to enhance both autoregressive and diffusion-based policies, without requiring fine-tuning or access to pre-trained model weights.',
      'Extensive experiments demonstrate PCD’s effectiveness and flexibility, consistently improving performance over three state-of-the-art policies across 15 manipulation tasks on multiple robotic platforms.'
    ]
  },
  {
    title: 'InSpire: VLA Models with Intrinsic Spatial Reasoning',
    date: 'Sep. 2025',
    image: new URL('../assets/publications/inspire.png', import.meta.url).href,
    description: 'Reducing spurious correlations in VLAs, boosting performance on <span class="highlight-red">seen (+6.2%)</span> and <span class="highlight-red">unseen (+10%)</span> tasks',
    tags: ['Robotics', 'Vision-Language-Action Models', 'Spatial Reasoning'],
    links: { // 新增链接
      project: 'https://koorye.github.io/proj/Inspire',
      arxiv: 'https://arxiv.org/abs/2412.11509',
      pdf: 'https://arxiv.org/pdf/2412.11509',
      code: 'https://github.com/Koorye/Inspire/'
    },
    abstract: 'Leveraging pretrained Vision-Language Models (VLMs) to map language instruction and visual observations to raw low-level actions, Vision-Language-Action models (VLAs) hold great promise for achieving general-purpose robotic systems. Despite their advancements, existing VLAs tend to spuriously correlate taskirrelevant visual features with actions, limiting their generalization capacity beyond the training data. To tackle this challenge, we propose Intrinsic Spatial Reasoning (InSpire), a simple yet effective approach that mitigates the adverse effects of spurious correlations by boosting the spatial reasoning ability of VLAs. Specifically, InSpire redirects the VLA’s attention to task-relevant factors by prepending the question “In which direction is the [object] relative to the robot?” to the language instruction and aligning the answer “right/left/up/down/front/back/grasped” and predicted actions with the ground-truth. Notably, InSpire can be used as a plugin to enhance existing autoregressive VLAs, requiring no extra training data or interaction with other large models. Extensive experimental results in both simulation and real-world environments demonstrate the effectiveness and flexibility of InSpire.',
    contributions: [
      'We propose InSpire, a novel approach designed to mitigate the negative impact of spurious correlations on the generalization performance of VLAs.',
      'Without employing extra data or interacting with other large models, InSpire endows VLAs with spatial reasoning capabilities in a plug-and-play manner.',
      'Comprehensive evaluations in both simulation and real-world environments demonstrate the effectiveness and flexibility of the proposed InSpire approach.'
    ]
  },
  {
    title: '<span class="highlight-red">[CVPR 2025]</span> Skip Tuning: Pre-trained Vision-Language Models are Effective and Efficient Adapters Themselves',
    date: 'Dec. 2024',
    image: new URL('../assets/publications/skiptuning.png', import.meta.url).href,
    description: 'Parameter-free adaptation method, <span class="highlight-red">+1.04%</span> accuracy with <span class="highlight-red">15x speedup</span> and <span class="highlight-red">6.4x memory efficiency</span>',
    tags: ['Vision-Language Models', 'Transfer Learning', 'Efficiency'],
    links: { // 新增链接
      arxiv: 'https://arxiv.org/abs/2412.11509',
      pdf: 'https://arxiv.org/pdf/2412.11509',
      code: 'https://github.com/Koorye/SkipTuning/'
    },
    abstract: 'Prompt tuning (PT) has long been recognized as an effective and efficient paradigm for transferring large pre-trained vision-language models (VLMs) to downstream tasks by learning a tiny set of context vectors. Nevertheless, in this work, we reveal that freezing the parameters of VLMs during learning the context vectors neither facilitates the transferability of pre-trained knowledge nor improves the memory and time efficiency significantly. Upon further investigation, we find that reducing both the length and width of the feature-gradient propagation flows of the full finetuning (FT) baseline is key to achieving effective and efficient knowledge transfer. Motivated by this, we propose Skip Tuning, a novel paradigm for adapting VLMs to downstream tasks. Unlike existing PT or adapter-based methods, Skip Tuning applies Layer-wise Skipping (LSkip) and Classwise Skipping (CSkip) upon the FT baseline without introducing extra context vectors or adapter modules. Extensive experiments across a wide spectrum of benchmarks demonstrate the superior effectiveness and efficiency of our Skip Tuning over both PT and adapter-based methods.',
    contributions: [
      'We reveal that reducing both the width and length of the feature-gradient propagation flows (FGPFs) of the full fine-tuning (FT) baseline is key to establishing effective and efficient knowledge transfer.',
      'We devise Skip Tuning, an effective and efficient method for transferring VLMs to downstream tasks without relying on extra context vectors or adapter modules.',
      'We evaluate our method on a wide spectrum of benchmarks, demonstrating the superiority of Skip Tuning over both prompt tuning and adapter-based approaches.'
    ]
  },
  {
    title: 'A Closer Look at Conditional Prompt Tuning for Vision-Language Models',
    date: 'Aug. 2024',
    image: new URL('../assets/publications/capt.png', import.meta.url).href,
    description: 'Identified critical issues in existing conditional prompt tuning methods, outperformed the state-of-the-art conditional PT methods by <span class="highlight-red">3.49%</span>',
    tags: ['Vision-Language Models', 'Transfer Learning', 'Prompt Tuning'],
    links: { // 新增链接
      arxiv: 'https://arxiv.org/abs/2506.23856',
      pdf: 'https://arxiv.org/pdf/2506.23856',
      code: 'https://github.com/Koorye/CaPT/'
    },
    abstract: 'Despite the great promise of Prompt Tuning (PT) in adapting large Vision-Language Pretrained Models (VLPMs) to downstream tasks, they often struggle to overcome the Base-New Tradeoff (BNT) dilemma: as VLPMs are better tuned to a base task, their ability to generalize to new tasks diminishes. Recent work on conditional PT addresses this problem by replacing static prompts with dynamic Visual Image Information (VII)-conditioned prompts, improving the model’s generalization to new tasks to some extent. In this work, we first identify a critical issue with existing conditional PT methods: using VII as the “condition” of prompts yields suboptimal performance, and even random noise-conditioned prompts can outperform the VII-conditioned counterparts. On further analysis, we find that learning dynamic prompts conditioned on Textual Class Information (TCI) is the key to solving the BNT problem. Motivated by this, we then propose Class-adaptive Prompt Tuning (CaPT), which enables fast adaptation of tuned models to new classes by learning TCI-conditioned prompts from base classes. Remarkably, CaPT can be used as a plugin to mitigate the BNT problem for existing unconditional PT schemes. Extensive experiments on 11 datasets show that CaPT consistently improves the performance of five strong unconditional PT baselines with negligible additional computational cost. Additionally, by integrating CaPT with our recently proposed DePT framework, we devise a new conditional PT approach, termed DeCaPT, which outperforms the H ACC of the state-of-the-art conditional PT scheme by <span class="highlight-red">3.49%</span>, averaged over the 11 datasets.',
    contributions: [
      'For the first time, we reveal that the key to mitigating the Base-New Tradeoff (BNT) problem in conditional prompt tuning lies in learning dynamic prompts conditioned on textual class information, rather than visual image information.',
      'We propose CaPT, the first TCI-conditioned PT scheme dedicated to tackling the BNT problem. Notably, CaPT can be flexibly integrated with existing unconditional PT paradigms.',
      'Our extensive experiments on 11 datasets prove the flexibility and effectiveness of CaPT—CaPT consistently improves the performance of a broad spectrum of PT methods across base-to-new generalization, cross-dataset generalization and cross-domain generalization settings.'
    ]
  },
  {
    title: '<span class="highlight-red">[CVPR 2024]</span> Decoupled Prompt Tuning',
    date: 'Nov. 2023',
    image: new URL('../assets/publications/dept.png', import.meta.url).href,
    description: 'Plug-and-play method providing <span class="highlight-red">+0.67%~2.65%</span> gains across prompt tuning baselines',
    tags: ['Vision-Language Models', 'Transfer Learning', 'Prompt Tuning'],
    links: { // 新增链接
      arxiv: 'https://arxiv.org/abs/2309.07439',
      pdf: 'https://arxiv.org/pdf/2309.07439',
      code: 'https://github.com/Koorye/DePT/'
    },
    abstract: 'This work breaks through the Base-New Tradeoff (BNT) dilemma in prompt tuning, i.e., the better the tuned model generalizes to the base (or target) task, the worse it generalizes to new tasks, and vice versa. Specifically, through an in-depth analysis of the learned features of the base and new tasks, we observe that the BNT stems from a channel bias issue – the vast majority of feature channels are occupied by base-specific knowledge, leading to the collapse of taskshared knowledge important to new tasks. To address this, we propose the Decoupled Prompt Tuning (DePT) framework, which decouples base-specific knowledge from feature channels into an isolated feature space during prompt tuning, so as to maximally preserve task-shared knowledge in the original feature space for achieving better zeroshot generalization on new tasks. Importantly, our DePT is orthogonal to existing prompt tuning approaches, and can enhance them with negligible additional computational cost. Extensive experiments on several datasets show the flexibility and effectiveness of DePT.',
    contributions: [
      'We provide an insightful analysis of the BNT problem in prompt tuning, revealing for the first time that the BNT stems from the channel bias issue.',
      'We propose the DePT framework to tackle the BNT problem from a feature decoupling perspective, and DePT is orthogonal to existing prompt tuning methods.',
      'We perform experiments on 11 diverse datasets and show that DePT consistently enhances the performance of a broad spectrum of baseline methods.'
    ]
  }
]);

// 奖项数据（不变）
const awards = ref([
  { icon: '🎓', title: 'Proposed Recommendation for Outstanding Graduate of Sichuan Province', issuer: 'Education Department of Sichuan', year: '2025' },
  { icon: '🎓', title: 'Outstanding Graduate Student', issuer: 'University of Electronic Science and Technology of China', year: '2025' },
  { icon: '💰', title: 'National Scholarship', issuer: 'Ministry of Education of the People\'s Republic of China', year: '2024' },
  { icon: '🎓', title: 'Outstanding Graduate', issuer: 'University of Electronic Science and Technology of China', year: '2023' },
  { icon: '💰', title: '"Shiqiang" Special Scholarship', issuer: 'University of Electronic Science and Technology of China', year: '2022' },
  { icon: '🏆', title: 'National Meritorious Winner', issuer: 'Mathematical Contest in Modeling (MCM)', year: '2021' },
  { icon: '🏆', title: 'National Bronze Award', issuer: 'China "Internet+" College Student Innovation Competition', year: '2021' }
]);

// 技能数据（不变）
const skillGroups = ref([
  {
    category: 'Programming Languages',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Java', level: 70 },
      { name: 'C/C++', level: 60 },
      { name: 'C/C#', level: 60 },
      { name: 'SQL', level: 60 },
    ]
  },
  {
    category: 'AI Frameworks',
    skills: [
      { name: 'PyTorch', level: 95 },
      { name: 'Scikit-Learn', level: 85 },
      { name: 'MMDetection', level: 80 },
      { name: 'TensorFlow/Keras', level: 70 },
      { name: 'JAX', level: 60 },
    ]
  },
  {
    category: 'Develop & DevOps',
    skills: [
      { name: 'SprintBoot', level: 80 },
      { name: 'Vue.js', level: 75 },
      { name: 'MySQL/Redis', level: 75 },
      { name: 'Docker', level: 70 },
      { name: 'Unity 3D', level: 65 }
    ]
  }
]);

// 滚动到指定章节（不变）
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// 获取技能等级对应的CSS类（不变）
const getSkillLevelClass = (level) => {
  if (level >= 90) return 'skill-expert';
  if (level >= 80) return 'skill-advanced';
  if (level >= 70) return 'skill-intermediate';
  return 'skill-beginner';
};

let scrollHandler = null;

// 新增：存储Star数（键：owner/repo，值：star数/loading/error）
const starCounts = ref({});

// 新增：解析GitHub仓库地址（从Code链接提取owner/repo）
const getRepoKey = (url) => {
  if (!url || !url.includes('github.com')) return '';
  // 匹配github.com/owner/repo格式（忽略后续路径）
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  return match ? `${match[1]}/${match[2]}` : '';
};

// 新增：调用GitHub API获取Star数
const fetchStarCount = async (repoKey) => {
  if (!repoKey) return;
  // 标记加载中
  starCounts.value[repoKey] = 'loading';
  try {
    // GitHub API端点（支持CORS）
    const res = await fetch(`https://api.github.com/repos/${repoKey}`);
    if (!res.ok) throw new Error('Repo not found');
    const data = await res.json();
    // 存储Star数
    starCounts.value[repoKey] = data.stargazers_count;
    // 可选：缓存到LocalStorage（过期1小时）
    localStorage.setItem(
      `star_${repoKey}`,
      JSON.stringify({ count: data.stargazers_count, expire: Date.now() + 3600000 })
    );
  } catch (err) {
    console.error(`Failed to fetch star count for ${repoKey}:`, err);
    starCounts.value[repoKey] = 'error';
  }
};

// 新增：初始化加载所有Code链接的Star数
const initStarCounts = () => {
  // 遍历所有publication的code链接
  publications.value.forEach(pub => {
    if (pub.links?.code) {
      const repoKey = getRepoKey(pub.links.code);
      if (!repoKey) return;
      // 优先读取缓存
      const cached = localStorage.getItem(`star_${repoKey}`);
      if (cached) {
        const { count, expire } = JSON.parse(cached);
        if (Date.now() < expire) {
          starCounts.value[repoKey] = count;
          return;
        }
      }
      // 无缓存则调用API
      fetchStarCount(repoKey);
    }
  });
};

// 原有：格式化链接文本
const formatLinkText = (key) => {
  const map = {
    project: 'Project',
    arxiv: 'ArXiv',
    pdf: 'PDF',
    code: 'Code'
  };
  return map[key] || key;
};

// 原有：获取图标HTML
const getIcon = (key) => {
  const iconMap = {
    project: '<i class="fas fa-globe"></i>',  // 项目：地球图标
    arxiv: '<i class="ai ai-arxiv"></i>',    // ArXiv：专用学术图标
    pdf: '<i class="fas fa-file-pdf"></i>',  // PDF：文件图标
    code: '<i class="fab fa-github"></i>'    // Code：GitHub图标
  };
  return iconMap[key] || '';
};

onMounted(() => {
  // 初始化Star数
  initStarCounts();

  // 监听滚动事件
  scrollHandler = () => {
    const scrollTop = document.querySelector('.content').scrollTop;
    // 遍历所有章节（包含新增的 news 和 gallery）
    sections.forEach(section => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const navItem = document.querySelector(`.navigation li[data-section="${section.id}"]`);
      if (navItem) {
        if (rect.top <= 50 && rect.bottom >= 50) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  };
  
  document.querySelector('.content').addEventListener('scroll', scrollHandler);
  
  // 初始化导航项的 data-section 属性（包含 gallery）
  document.querySelectorAll('.navigation li').forEach((li, index) => {
    li.setAttribute('data-section', sections[index].id);
  });
});

onUnmounted(() => {
  if (scrollHandler) {
    document.querySelector('.content').removeEventListener('scroll', scrollHandler);
  }
});
</script>

<style scoped>
/* 原有样式保持不变，新增以下样式 */

/* ========== News 板块样式 ========== */
.news-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  position: relative;
}

.news-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #a0c1d9;
}

.news-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 0.8rem 0;
}

.news-date {
  min-width: 80px;
  font-weight: 600;
  color: #0056b3;
  font-size: 0.9rem;
  white-space: nowrap;
}

.news-content {
  flex: 1;
  background-color: #f8f9fa;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  border-left: 3px solid #a0c1d9;
}

.news-content p {
  margin: 0;
  line-height: 1.5;
}

/* ========== Publications 链接样式 ========== */
.pub-links {
  margin-top: 1rem;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

/* 新增：Star数样式 */
.pub-link-btn {
  padding: 4px 12px 4px 28px;
  position: relative;
  background-color: #e6f2ff;
  color: #0056b3;
  border-radius: 4px;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #d1e7ff;
  display: inline-flex; /* 适配Star数横向排列 */
  align-items: center;
  gap: 6px; /* 文字和Star数之间的间距 */
}

.pub-link-btn .link-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1em;
}

/* Star数样式 */
.star-count {
  color: #ff9800; /* 金色Star */
  font-weight: 600;
  font-size: 0.8em;
  margin-left: 4px;
}

.star-count .fa-spinner {
  color: #0056b3; /* 加载中：蓝色 */
  font-size: 0.9em;
}

.star-count .fa-exclamation-circle {
  color: #e74c3c; /* 错误：红色 */
  font-size: 0.9em;
}

/* ========== Gallery Swiper 样式 ========== */
.gallery-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.my-swiper {
  --swiper-navigation-color: #fff;
  --swiper-pagination-color: #fff;
  --swiper-pagination-bullet-inactive-color: rgba(255, 255, 255, 0.5);
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-size: 10px;
  --swiper-pagination-bullet-horizontal-gap: 8px;
}

.swiper-slide-custom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-slide-content {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-slide-content:hover .gallery-image {
  transform: scale(1.05);
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  transform: translateY(0);
}

.gallery-caption h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.gallery-caption p {
  margin: 0;
  font-size: 0.95rem;
  color: #fff;
}

/* Swiper 导航按钮样式 */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transition: background 0.3s ease;
}

:deep(.swiper-button-prev:hover),
:deep(.swiper-button-next:hover) {
  background: rgba(0, 0, 0, 0.7);
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 18px;
  font-weight: bold;
}

/* Swiper 分页器样式 */
:deep(.swiper-pagination) {
  bottom: 20px;
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #fff;
}

/* ========== 响应式适配 ========== */
@media (max-width: 768px) {
  .news-timeline {
    padding-left: 0;
  }
  
  .news-timeline::before {
    display: none;
  }
  
  .news-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .news-date {
    min-width: unset;
    color: #e74c3c;
  }
  
  .news-content {
    padding: 0.6rem 1rem;
  }
  
  /* Gallery Swiper 响应式 */
  .gallery-slide-content {
    height: 300px;
  }
  
  .gallery-caption {
    padding: 1.5rem 1rem 1rem;
  }
  
  .gallery-caption h3 {
    font-size: 1.1rem;
  }
  
  .gallery-caption p {
    font-size: 0.85rem;
  }
  
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 36px;
    height: 36px;
  }
  
  :deep(.swiper-button-prev::after),
  :deep(.swiper-button-next::after) {
    font-size: 16px;
  }
}

/* 原有样式（无需修改） */
.home-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background-color: #e6f2ff;
  padding: 2rem 1.5rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.profile-section {
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #a0c1d9;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
}

.name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.location {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.navigation {
  flex: 1;
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navigation li {
  padding: 0.3rem 0rem;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
  text-align: center;
}

.navigation li:hover {
  background-color: #c2d9f0;
}

.navigation li.active {
  background-color: #a0c1d9;
  color: white;
}

.content {
  flex: 1;
  margin-left: 280px;
  overflow-y: auto;
  height: 100vh;
  background-color: white;
}

/* Banner 样式（不变） */
.banner-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  transition: max-height 1.0s cubic-bezier(0.6, 0, 0.4, 1), 
              box-shadow 0.3s ease;
  will-change: max-height;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
  display: block;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  transition: mask-image 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
              -webkit-mask-image 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.banner-container:hover {
  max-height: 2000px;
}

.banner-container:hover .banner {
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
  transform: translateZ(0) scale(1.02);
  -webkit-transform: translateZ(0) scale(1.02);
}

.banner-caption {
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1.5rem;
  transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-container:hover + .banner-caption {
  color: #555;
}

.content-wrapper {
  padding: 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-header {
  margin-bottom: 0.5rem;
  padding-bottom: 1.5rem;
}

.content-header h1 {
  font-size: 4.5rem;
  font-weight: 700;
  margin-top: -3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
}

.section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #0056b3;
  padding-bottom: 0.5rem;
}

.section p {
  line-height: 1.6;
  color: #444;
}

.p-close {
  margin-bottom: 0.3rem;
  color: #444;
}

.highlight-red {
  color: #e74c3c;
  font-weight: 600;
}

.highlight-blue {
  color: #3498db;
  font-weight: 600;
}

.highlight-blue-bold {
  color: #3498db;
  font-weight: 700;
}

.highlight-link {
  color: #2980b9;
  text-decoration: none;
  font-weight: 600;
}

.highlight-link:hover {
  text-decoration: underline;
}

/* 时间轴样式（不变） */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  position: relative;
  z-index: 2;
}

.logo {
  width: 100px;
  padding: 5px;
  border-radius: 5px;
}

.timeline-line {
  width: 2px;
  height: 100%;
  background-color: #a0c1d9;
  margin-top: 10px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 20px;
}

.timeline-date {
  color: #888;
  font-weight: normal;
  font-size: 0.9rem;
}

.exp-details {
  margin-top: 0.5rem;
}

/* 出版物样式（不变，仅新增链接样式） */
.publication-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ========== Publications 悬停效果样式 ========== */
.publication-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  height: auto;
  cursor: pointer;
  padding-left: 10px;
}

.publication-item:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 12px 20px rgba(0,0,0,0.15);
}

.publication-item .click-tip {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
  margin-bottom: 0.5rem;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  opacity: 1;
  visibility: visible; /* 默认显示 */
}

/* 当卡片展开时，隐藏提示文字 */
.publication-item .pub-details.show-details + .click-tip {
  opacity: 0;
  visibility: hidden; /* 隐藏（不占空间） */
  height: 0; /* 确保不占底部空间 */
  margin-bottom: 0;
}

/* 细节内容区域样式 */
.pub-details {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.5s ease;
  padding: 0 1.5rem;
}

.pub-details.show-details {
  max-height: 1000px;
  opacity: 1;
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  color: #0056b3;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.detail-section p {
  font-size: 0.98rem;
  line-height: 1.7;
  color: #333;
}

.detail-section ul {
  padding-left: 1.8rem;
  margin: 0;
}

.detail-section li {
  font-size: 0.98rem;
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: #333;
}

.detail-section li:last-child {
  margin-bottom: 0;
}

/* 图片悬停效果增强 */
.publication-image img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .pub-details.show-details {
    max-height: 1000px;
  }
}


.pub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #eff4ff;
}

.pub-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0056b3;
}

.pub-date {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  background-color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #d1e7ff;
}

.pub-body {
  display: flex;
  flex: 1;
}

.publication-image {
  flex: 0 0 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publication-image img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.publication-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.publication-content p {
  margin: 0;
  line-height: 1.6;
}

.pub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  display: inline-block;
  background-color: #e1f0fa;
  color: #2980b9;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.click-tip {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
  margin-bottom: 0.5rem;
}

/* 奖项样式（不变） */
.award-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0056b3;
  transition: transform 0.3s ease;
  margin-bottom: 1rem;
}

.award-icon {
  font-size: 2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.award-content h3 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;
}

.award-content p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

/* 技能样式（不变） */
.skills-container {
  display: flex;
  gap: 1.5rem;
}

.skill-category {
  width: 33.3%;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #0056b3;
}

.skill-category h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.2rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-weight: 500;
}

.skill-level {
  font-size: 0.9rem;
  color: #666;
}

.skill-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.skill-expert {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
}

.skill-advanced {
  background: linear-gradient(90deg, #3498db, #2980b9);
}

.skill-intermediate {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

.skill-beginner {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

/* ========== 修改后的联系信息样式 ========== */
.contact-info {
  text-align: center;
  padding: 1rem 0;
}

.contact-title {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* 联系链接容器 - 改为网格布局，适配图标+文字 */
.contact-links {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2列布局，美观紧凑 */
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  padding: 0 0.5rem;
}

/* 单个联系链接 - 图标+文字横向排列 */
.contact-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* 图标和文字间距 */
  text-decoration: none;
  color: #333;
  background-color: #f0f7ff;
  padding: 0.6rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

/* 悬停效果优化 */
.contact-link:hover {
  background-color: #d1e7ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.contact-icon {
  width: 22px; /* 图标尺寸微调，适配文字 */
  height: 22px;
  display: inline-block;
}

.contact-text {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap; /* 防止文字换行 */
}

.contact-desc {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
}

/* ========== 响应式适配（保持原有逻辑，补充联系区域适配） ========== */
@media (max-width: 768px) {
  /* 移动端联系链接改为1列布局 */
  .contact-links {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
  
  .contact-link {
    padding: 0.5rem 0.5rem;
  }
  
  /* 其他原有响应式样式保持不变 */
}

.primary-color {
  color: #1569c4;
}

/* 响应式设计（不变） */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    overflow: auto;
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }
  
  .content {
    margin-left: 0;
    height: auto;
    overflow-y: visible;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .navigation {
    flex: none;
  }
  
  .content-header h1 {
    font-size: 3rem;
    margin-top: 0;
  }
  
  .timeline {
    padding-left: 0;
  }
  
  .timeline::before {
    display: none;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-marker {
    margin-right: 0;
    margin-bottom: 10px;
    flex-direction: row;
  }
  
  .timeline-line {
    width: 100%;
    height: 2px;
    margin-top: 0;
    margin-left: 10px;
  }
  
  .publication-item {
    flex-direction: column;
  }
  
  .publication-image {
    flex: 0 0 150px;
  }
  
  .pub-header {
    flex-direction: column;
  }
  
  .pub-date {
    margin-top: 0.3rem;
  }
  
  .awards-grid {
    grid-template-columns: 1fr;
  }

  /* Banner 移动端适配 */
  .banner-container {
    max-height: 200px;
    transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .banner {
    transition: mask-image 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                -webkit-mask-image 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@media (min-width: 1200px) {
  .content-wrapper {
    padding: 3rem 4rem;
  }
}

/* 滚动条样式优化 */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深度选择器（不变） */
:deep(.highlight-red) {
  color: #e74c3c;
  font-weight: 600;
}

:deep(.highlight-blue) {
  color: #3498db;
  font-weight: 600;
}

:deep(.highlight-blue-bold) {
  color: #3498db;
  font-weight: 700;
}

:deep(.highlight-link) {
  color: #2980b9;
  text-decoration: none;
  font-weight: 600;
}

:deep(.highlight-link:hover) {
  text-decoration: underline;
}
</style>