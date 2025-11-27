export default {
  title: '发表论文',
  buttons: {
    'project': '项目',
    'arxiv': 'ArXiv',
    'pdf': 'PDF',
    'code': '代码',
    'click': '点击查看详情',
    'abstract': '摘要',
    'contributions': '主要贡献'
  },
  'data': [
    {
      title: 'RoboCOIN: An Open-Sourced Bimanual Robotic Data COllection for INtegrated Manipulation',
      date: '2025年11月',
      image: new URL('../../assets/publications/robocoin.png', import.meta.url).href,
      description: '开源大规模双臂操作机器人数据集，涵盖 <span class="highlight-red">15 种机器人平台</span> 和 <span class="highlight-red">180K+ 高质量轨迹</span>',
      tags: ['机器人学', '数据集'],
      links: {
        project: 'https://flagopen.github.io/RoboCOIN/',
        arxiv: 'https://arxiv.org/abs/2511.17441',
        pdf: 'https://arxiv.org/pdf/2511.17441',
        code: 'https://github.com/FlagOpen/RoboCOIN/'
      },
      abstract: '双臂操作对于实现类人机器人灵活性至关重要，但由于机器人平台之间的硬件异质性，大规模多样化的双臂机器人数据集仍然稀缺。为了解决这一挑战，我们提出了 RoboCOIN，一个综合性的多平台双臂操作数据集，收集了来自 15 种不同机器人平台的超过 <span class="highlight-red">180,000 条演示轨迹</span>。该数据集涵盖了 <span class="highlight-red">16 种场景</span>，包括住宅、商业和工作环境，系统地组织了 <span class="highlight-red">421 个任务</span>，这些任务根据双臂协调模式和物体属性进行分类。我们的关键创新是一个分层能力金字塔，提供多级注释，涵盖轨迹级概念、片段级子任务和帧级运动学。我们进一步开发了 CoRobot，一个综合处理框架，具有机器人轨迹标记语言（RTML）用于质量评估、自动注释生成和统一的多平台管理。大量实验表明，RoboCOIN 在多平台双臂学习中具有可靠性和有效性，在各种模型架构和机器人平台上显著提升了性能。完整的数据集和框架已开源并公开供进一步研究使用。',
      contributions: [
        '<span class="highlight-red">大规模多平台双臂数据集。</span> 我们引入了 RoboCOIN，一个综合性的数据集，包含来自 15 种不同机器人平台的超过 180,000 条演示轨迹，涵盖 421 个任务。',
        '<span class="highlight-red">分层能力金字塔。</span> 我们提出了一个分层能力金字塔，包含轨迹级、片段级和帧级描述，实现了从高层次全局概念到低层次控制的多分辨率学习。',
        '<span class="highlight-red">综合数据处理框架。</span> 我们开发了一个名为 CoRobot 的统一数据处理框架，包括基于 RTML 的评估、自动注释工具链以及用于统一多平台数据集管理和机器人部署的平台。'
      ]
    },
    {
      title: 'Policy Contrastive Decoding for Robotic Foundation Models',
      date: '2025年9月',
      image: new URL('../../assets/publications/pcd.png', import.meta.url).href,
      description: '提升机器人基础模型泛化能力，仿真环境提升 <span class="highlight-red">8%</span>，真实环境提升 <span class="highlight-red">108%</span>',
      tags: ['机器人学', '机器人基础模型', '测试时增强'],
      links: {
        project: 'https://koorye.github.io/proj/PCD',
        arxiv: 'https://arxiv.org/abs/2505.13255',
        pdf: 'https://arxiv.org/pdf/2505.13255',
        code: 'https://github.com/Koorye/PCD/'
      },
      abstract: '机器人基础模型或通用机器人策略在实现灵活、通用和灵巧的机器人系统方面具有巨大潜力。尽管取得了进展，我们的实证实验表明，现有的机器人策略容易从预训练轨迹中学习到虚假的相关性，从而对其超出训练数据的泛化能力产生不利影响。为了解决这个问题，我们提出了一种新颖的策略对比解码（PCD）方法，通过对比来自原始和对象遮挡视觉输入的动作概率分布，将机器人策略的注意力重新引导到与对象相关的视觉线索上。作为一种无需训练的方法，我们的 PCD 可以作为插件使用，以提高不同类型的机器人策略，而无需微调或访问模型权重。我们在三个开源机器人策略之上进行了广泛的实验，包括自回归策略 OpenVLA 和基于扩散的策略 Octo 和 π0。在仿真和真实环境中获得的结果证明了 PCD 的灵活性和有效性，例如，PCD 在仿真环境中将最先进的策略 π0 提升了 <span class="highlight-red">8%</span>，在真实环境中提升了 <span class="highlight-red">108%</span>。',
      contributions: [
        '我们提出了 PCD，一种简单、无需训练且易于实现的方法来解决机器人策略中的虚假相关性问题。',
        'PCD 可以作为插件使用，以增强自回归和基于扩散的策略，而无需微调或访问预训练模型权重。',
        '大量实验表明，PCD 的有效性和灵活性，在多个机器人平台上的 15 个操作任务中，始终提升了三种最先进策略的性能。'
      ]
    },
    {
      title: 'InSpire: VLA Models with Intrinsic Spatial Reasoning',
      date: '2025年9月',
      image: new URL('../../assets/publications/inspire.png', import.meta.url).href,
      description: '提升 VLA 模型空间推理能力，已见任务提升 <span class="highlight-red">6.2%</span>，未见任务提升 <span class="highlight-red">10%</span>',
      tags: ['机器人学', '视觉-语言-动作模型', '空间推理'],
      links: {
        project: 'https://koorye.github.io/proj/Inspire',
        arxiv: 'https://arxiv.org/abs/2412.11509',
        pdf: 'https://arxiv.org/pdf/2412.11509',
        code: 'https://github.com/Koorye/Inspire/'
      },
      abstract: '利用预训练的视觉-语言模型（VLM）将语言指令和视觉观察映射到低级动作，视觉-语言-动作模型（VLA）在实现通用机器人系统方面具有巨大潜力。尽管取得了进展，现有的 VLA 往往会将与任务无关的视觉特征与动作产生虚假的相关性，从而限制了其超出训练数据的泛化能力。为了解决这一挑战，我们提出了内在空间推理（InSpire），这是一种简单而有效的方法，通过提升 VLA 的空间推理能力来减轻虚假相关性的负面影响。具体而言，InSpire 通过在语言指令前添加问题“[对象] 相对于机器人处于哪个方向？”并将答案“右/左/上/下/前/后/抓取”与预测动作对齐来引导 VLA 的注意力集中在与任务相关的因素上。值得注意的是，InSpire 可以作为插件使用，以增强现有的自回归 VLA，无需额外的训练数据或与其他大型模型交互。在仿真和真实环境中获得的大量实验结果证明了 InSpire 的有效性和灵活性。',
      contributions: [
        '我们提出了 InSpire，一种新颖的方法，旨在减轻虚假相关性对 VLA 泛化性能的负面影响。',
        'InSpire 以插件方式为 VLA 提供空间推理能力，无需额外数据或与其他大型模型交互。',
        '在仿真和真实环境中进行的全面评估证明了所提出的 InSpire 方法的有效性和灵活性。'
      ]
    },
    {
      title: '<span class="highlight-red">[CVPR 2025]</span> Skip Tuning: Pre-trained Vision-Language Models are Effective and Efficient Adapters Themselves',
      date: '2024年12月',
      image: new URL('../../assets/publications/skiptuning.png', import.meta.url).href,
      description: '无需额外参数的适配方法，<span class="highlight-red">提升 1.04%</span> 准确率，<span class="highlight-red">加速 15 倍</span>，<span class="highlight-red">节省 6.4 倍</span> 内存',
      tags: ['视觉-语言模型', '迁移学习', '效率'],
      links: {
        arxiv: 'https://arxiv.org/abs/2412.11509',
        pdf: 'https://arxiv.org/pdf/2412.11509',
        code: 'https://github.com/Koorye/SkipTuning/'
      },
      abstract: '提示调优（PT）长期以来被认为是一种有效且高效的范式，通过学习一小组上下文向量将大型预训练视觉-语言模型（VLM）转移到下游任务。然而，在本工作中，我们揭示了在学习上下文向量时冻结 VLM 参数既不能促进预训练知识的可转移性，也不能显著提高内存和时间效率。经过进一步调查，我们发现减少全微调（FT）基线的特征梯度传播流的长度和宽度对于实现有效且高效的知识转移至关重要。受此启发，我们提出了 Skip Tuning，这是一种将 VLM 适配到下游任务的新范式。与现有的 PT 或基于适配器的方法不同，Skip Tuning 在 FT 基线上应用了层跳跃（LSkip）和类跳跃（CSkip），而无需引入额外的上下文向量或适配器模块。在广泛的基准测试中进行的大量实验表明，我们的 Skip Tuning 在有效性和效率方面优于 PT 和基于适配器的方法。',
      contributions: [
        '我们揭示了减少全微调（FT）基线的特征梯度传播流的长度和宽度对于实现有效且高效的知识转移至关重要。',
        '我们设计了 Skip Tuning，这是一种将 VLM 适配到下游任务的新方法，无需依赖额外的上下文向量或适配器模块。',
        '我们在广泛的基准测试中评估了我们的方法，证明了 Skip Tuning 在有效性和效率方面优于提示调优和基于适配器的方法。'
      ]
    },
    {
      title: 'A Closer Look at Conditional Prompt Tuning for Vision-Language Models',
      date: '2024年8月',
      image: new URL('../../assets/publications/capt.png', import.meta.url).href,
      description: '发现现有条件提示调优方法中的关键问题，在 11 个数据集上平均超越最先进的条件 PT 方法 <span class="highlight-red">3.49%</span>',
      tags: ['视觉-语言模型', '迁移学习', '提示调优'],
      links: {
        arxiv: 'https://arxiv.org/abs/2506.23856',
        pdf: 'https://arxiv.org/pdf/2506.23856',
        code: 'https://github.com/Koorye/CaPT/'
      },
      abstract: '尽管提示调优（PT）在将大型视觉-语言预训练模型（VLPM）适配到下游任务方面展现出巨大潜力，但它们往往难以克服基础-新任务权衡（BNT）困境：随着 VLPM 更好地适应基础任务，其泛化到新任务的能力会下降。最近关于条件 PT 的工作通过用动态的视觉图像信息（VII）条件化提示来替换静态提示，在一定程度上改善了模型对新任务的泛化能力。在本工作中，我们首先发现了现有条件 PT 方法的一个关键问题：使用 VII 作为提示的“条件”会导致性能不佳，甚至随机噪声条件化的提示也能胜过 VII 条件化的对应方法。经过进一步分析，我们发现学习基于文本类别信息（TCI）条件化的动态提示是解决 BNT 问题的关键。受此启发，我们提出了类适应性提示调优（CaPT），通过从基础类别学习 TCI 条件化提示，实现对新类别的快速适应。值得注意的是，CaPT 可以作为插件使用，以缓解现有无条件 PT 方案中的 BNT 问题。在 11 个数据集上进行的大量实验表明，CaPT 始终提升了五个强大的无条件 PT 基线的性能，且几乎没有额外的计算成本。此外，通过将 CaPT 与我们最近提出的 DePT 框架相结合，我们设计了一种新的条件 PT 方法，称为 DeCaPT，其 H ACC 超过了最先进的条件 PT 方案，平均提升了 <span class="highlight-red">3.49%</span>。',
      contributions: [
        '我们首次揭示了缓解条件提示调优中基础-新任务权衡（BNT）问题的关键在于学习基于文本类别信息的动态提示，而非视觉图像信息。',
        '我们提出了 CaPT，这是首个专门针对 BNT 问题的 TCI 条件化提示调优方案。值得注意的是，CaPT 可以灵活地与现有的无条件提示调优范式集成。',
        '我们在 11 个数据集上进行了大量实验，证明了 CaPT 的灵活性和有效性——CaPT 在基础到新任务泛化、跨数据集泛化和跨域泛化设置中始终提升了广泛的提示调优方法的性能。'
      ]
    },
    {
      title: '<span class="highlight-red">[CVPR 2024]</span> Decoupled Prompt Tuning',
      date: '2023年11月',
      image: new URL('../../assets/publications/dept.png', import.meta.url).href,
      description: '突破提示调优中的基础-新任务权衡困境，平均提升新任务性能 <span class="highlight-red">2.65%</span>',
      tags: ['视觉-语言模型', '迁移学习', '提示调优'],
      links: {
        arxiv: 'https://arxiv.org/abs/2309.07439',
        pdf: 'https://arxiv.org/pdf/2309.07439',
        code: 'https://github.com/Koorye/DePT/'
      },
      abstract: '本工作突破了提示调优中的基础-新任务权衡（BNT）困境：即调优后的模型对基础（或目标）任务的泛化能力越强，对新任务的泛化能力就越差，反之亦然。具体而言，通过对基础和新任务学习特征的深入分析，我们观察到 BNT 源于通道偏差问题——绝大多数特征通道被基础特定知识占据，导致对新任务重要的任务共享知识崩溃。为了解决这个问题，我们提出了分离提示调优（DePT）框架，在提示调优过程中将基础特定知识从特征通道中分离到一个隔离的特征空间中，从而最大限度地保留原始特征空间中的任务共享知识，以实现对新任务的更好零样本泛化。值得注意的是，我们的 DePT 与现有的提示调优方法是正交的，可以以极低的额外计算成本增强它们。在多个数据集上进行的大量实验展示了 DePT 的灵活性和有效性。',
      contributions: [
        '我们首次揭示了提示调优中基础-新任务权衡（BNT）问题的关键在于通道偏差问题。',
        '我们提出了 DePT 框架，从特征解耦的角度解决 BNT 问题，DePT 与现有的提示调优方法是正交的。',
        '我们在 11 个多样化的数据集上进行了实验，表明 DePT 始终增强了广泛基线方法的性能。'
      ]
    }
  ]
}