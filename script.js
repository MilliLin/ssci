// 1. 初始权重配置：根据你划分的5组门类
const subjectWeights = {
  "group_02_12": { name: "经管法领地", social: 1.5, learning: 1.0, persistence: 1.2, luck: 1.3, platform: 1.5 },
  "group_01_05_06": { name: "人文老钱派", social: 0.8, learning: 1.5, persistence: 1.8, luck: 1.0, platform: 0.9 },
  "group_04_14": { name: "社科实证派", social: 1.0, learning: 1.5, persistence: 1.2, luck: 1.0, platform: 1.1 },
  "group_07_10": { name: "硬核实验组", social: 0.5, learning: 1.2, persistence: 1.5, luck: 1.1, platform: 1.8 },
  "group_military": { name: "跨界开拓者", social: 1.2, learning: 1.1, persistence: 1.0, luck: 1.5, platform: 1.2 }
};

// 2. 初始化用户状态
let userStats = {
  subject: null,
  social: 0,
  learning: 0,
  persistence: 0,
  luck: 0,
  platform: 0
};

// 3. 核心交互：点击选中效果与数据记录
document.querySelectorAll('.options button').forEach(button => {
  button.addEventListener('click', function() {
    // 视觉反馈：切换选中状态 (选项 B 逻辑：通过父元素寻找兄弟)
    const parent = this.parentElement;
    parent.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');

    // 数据记录
    if (this.classList.contains('subject-btn')) {
      userStats.subject = this.getAttribute('data-id');
    } else {
      const dim = this.getAttribute('data-id') || this.getAttribute('data-dim');
      const points = parseInt(this.getAttribute('data-points'));
      userStats[dim] = points;
    }
  });
});

// 4. 段位评价逻辑
function getRank(score) {
  if (score >= 90) return { 
    title: "SSCI 收割机 🚜", 
    desc: "你是学术界的顶级猎食者，审稿人看到你的名字都要尊成一声‘大牛’。",
    share: "转到朋友圈并屏蔽导师：‘哎，这种测试一点都不准，我明明只是个学术废柴。’"
  };
  if (score >= 70) return { 
    title: "学术潜力股 📈", 
    desc: "假以时日，你必能在顶刊拥有一席之地。现在差的可能只是一点点运气。",
    share: "私发给导师：‘老师，这个测试说我有潜力，您看明年的顶刊咱们是不是...’"
  };
  if (score >= 45) return { 
    title: "学术搬砖人 🧱", 
    desc: "虽然还在摸索，但胜在勤奋。记住，每一篇被拒的稿子都是通往成功的阶梯。",
    share: "带图转发：‘SSCI是什么？我只知道我的发际线正在撤退。’"
  };
  return { 
    title: "学术锦鲤 🐟", 
    desc: "科研可能不是你的唯一出路，但你的运气和心态绝对是圈内顶尖。",
    share: "转发并配文：‘既然论文发不出，那就祝大家科研不掉头发吧！’"
  };
}

// 5. 提交按钮逻辑：计算、加载与结果展示
document.getElementById('submit-quiz').addEventListener('click', function() {
  // 检查是否选了第一题
  if (!userStats.subject) {
    alert("请先选择你的学科门类！");
    return;
  }

  // A. 显示加载层 (显式设置 flex 以居中)
  const loader = document.getElementById('loading-overlay');
  loader.style.display = 'flex';
  loader.classList.remove('hidden');

  // B. 模拟“匿名评审”过程 (2秒)
  setTimeout(() => {
    // 1. 获取对应学科权重
    const w = subjectWeights[userStats.subject];
    
    // 2. 加权总分计算 (原始分 * 权重)
    let rawScore = 
      (userStats.social * w.social) + 
      (userStats.learning * w.learning) +
      (userStats.persistence * w.persistence) +
      (userStats.luck * w.luck) +
      (userStats.platform * w.platform);

    // 3. 映射到百分制并获取段位
    const finalScore = Math.min(100, Math.round(rawScore * 1.5));
    const rank = getRank(finalScore);

    // 4. 填充结果数据
    document.getElementById('rank-title').innerText = rank.title;
    document.getElementById('rank-desc').innerText = rank.desc;
    document.getElementById('share-text').innerText = rank.share; // 这里放置转发文案

    // 5. 切换层级：隐藏加载层，显示结果层
    loader.style.display = 'none';
    loader.classList.add('hidden');
    
    const resultOverlay = document.getElementById('result-overlay');
    resultOverlay.style.display = 'flex';
    resultOverlay.classList.remove('hidden');
    
  }, 2000); 
});

window.resetQuiz = function() { // 使用 window. 定义确保 HTML 能找到它
  // 1. 隐藏结果弹窗
  const resultOverlay = document.getElementById('result-overlay');
  resultOverlay.style.display = 'none';
  resultOverlay.classList.add('hidden');

  // 2. 重置后台数据
  userStats = {
    subject: null,
    social: 0,
    learning: 0,
    persistence: 0,
    luck: 0,
    platform: 0
  };

  // 3. 清除所有被选中的按钮样式
  document.querySelectorAll('.selected').forEach(btn => {
    btn.classList.remove('selected');
  });

  // 4. 回到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  console.log("数据已重置，已回到顶部");
};
