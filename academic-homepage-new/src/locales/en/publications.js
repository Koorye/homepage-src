export default {
  'title': 'Publications',
  'buttons': {
    'project': 'Project',
    'arxiv': 'ArXiv',
    'pdf': 'PDF',
    'code': 'Code',
    'click': 'Click for Details',
    'abstract': 'Abstract',
    'contributions': 'Contributions'
  },
  'data': [
    {
      title: 'RoboCOIN: An Open-Sourced Bimanual Robotic Data COllection for INtegrated Manipulation',
      date: 'Nov. 2025',
      image: new URL('../../assets/publications/robocoin.png', import.meta.url).href,
      description: 'Open-sourced large-scale bimanual robotic dataset with <span class="highlight-red">15 robotic platforms</span> and <span class="highlight-red">180K+ demonstrations</span>, collaborated with <span class="highlight-red">20 institutions</span>',
      tags: ['Robotics', 'Dataset'],
      links: {
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
      image: new URL('../../assets/publications/pcd.png', import.meta.url).href,
      description: 'Universal framework for multiple VLA architectures, achieving <span class="highlight-red">+8%~41%</span> improvement without training',
      tags: ['Robotics', 'Vision-Language-Action Models', 'Test-Time'],
      links: {
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
      image: new URL('../../assets/publications/inspire.png', import.meta.url).href,
      description: 'Reducing spurious correlations in VLAs, boosting performance on <span class="highlight-red">seen (+6.2%)</span> and <span class="highlight-red">unseen (+10%)</span> tasks',
      tags: ['Robotics', 'Vision-Language-Action Models', 'Spatial Reasoning'],
      links: {
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
      image: new URL('../../assets/publications/skiptuning.png', import.meta.url).href,
      description: 'Parameter-free adaptation method, <span class="highlight-red">+1.04%</span> accuracy with <span class="highlight-red">15x speedup</span> and <span class="highlight-red">6.4x memory efficiency</span>',
      tags: ['Vision-Language Models', 'Transfer Learning', 'Efficiency'],
      links: {
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
      image: new URL('../../assets/publications/capt.png', import.meta.url).href,
      description: 'Identified critical issues in existing conditional prompt tuning methods, outperformed the state-of-the-art conditional PT methods by <span class="highlight-red">3.49%</span>',
      tags: ['Vision-Language Models', 'Transfer Learning', 'Prompt Tuning'],
      links: {
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
      image: new URL('../../assets/publications/dept.png', import.meta.url).href,
      description: 'Plug-and-play method providing <span class="highlight-red">+0.67%~2.65%</span> gains across prompt tuning baselines',
      tags: ['Vision-Language Models', 'Transfer Learning', 'Prompt Tuning'],
      links: {
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
  ]
}