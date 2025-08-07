// d3.js skill graph visualization for about page
// Node data structure: { id, label, group, value }
// Link data structure: { source, target }

const skillData = {
  nodes: [
    { id: 'core', label: 'Woke Soul', group: 'core', value: 52, icon: 'fa-solid fa-user-astronaut', desc: '自我成长与探索者' },
    { id: 'tech', label: '技术技能', group: 'main', value: 36, icon: 'fa-solid fa-laptop-code', desc: 'AI、编程、数据、Web' },
    { id: 'humanity', label: '人文素养', group: 'main', value: 36, icon: 'fa-solid fa-book-open', desc: '文学、电影、表达' },
    // 技术技能分支
    { id: 'ml', label: '机器学习/深度学习', group: 'tech', value: 28, icon: 'fa-solid fa-brain', level: 'Expert', percent: 90, desc: '精通PyTorch、Transformer、AI竞赛、科研项目' },
    { id: 'python', label: 'Python 编程', group: 'tech', value: 26, icon: 'fa-brands fa-python', level: 'Expert', percent: 95, desc: '10万行+经验，数据/AI/自动化/后端全栈' },
    { id: 'data', label: '数据分析', group: 'tech', value: 22, icon: 'fa-solid fa-chart-line', level: 'Advanced', percent: 85, desc: 'Pandas、可视化、数据建模、数据驱动决策' },
    { id: 'web', label: 'Web开发', group: 'tech', value: 20, icon: 'fa-solid fa-globe', level: 'Advanced', percent: 80, desc: 'Hugo、React、Node、全栈项目实践' },
    { id: 'invest', label: '价值投资', group: 'tech', value: 18, icon: 'fa-solid fa-coins', level: 'Intermediate', percent: 75, desc: 'A股、美股、基金、量化与基本面分析' },
    // 人文素养分支
    { id: 'literature', label: '文学鉴赏', group: 'humanity', value: 26, icon: 'fa-solid fa-feather', level: 'Advanced', percent: 90, desc: '诗歌、小说、散文、批评性阅读' },
    { id: 'film', label: '电影评析', group: 'humanity', value: 24, icon: 'fa-solid fa-film', level: 'Advanced', percent: 85, desc: '影史、导演、类型分析、影评写作' },
    { id: 'writing', label: '写作表达', group: 'humanity', value: 22, icon: 'fa-solid fa-pen-nib', level: 'Advanced', percent: 80, desc: '随笔、论文、公众号、演讲表达' },
    { id: 'art', label: '艺术审美', group: 'humanity', value: 18, icon: 'fa-solid fa-palette', level: 'Intermediate', percent: 70, desc: '美术、摄影、音乐、设计' },
  ],
  links: [
    { source: 'core', target: 'tech' },
    { source: 'core', target: 'humanity' },
    { source: 'tech', target: 'ml' },
    { source: 'tech', target: 'python' },
    { source: 'tech', target: 'data' },
    { source: 'tech', target: 'web' },
    { source: 'tech', target: 'invest' },
    { source: 'humanity', target: 'literature' },
    { source: 'humanity', target: 'film' },
    { source: 'humanity', target: 'writing' },
    { source: 'humanity', target: 'art' },
  ]
};

function drawSkillGraph(selector) {
  // 响应式宽度
  const container = document.querySelector(selector);
  let width = Math.min(container.offsetWidth || 600, 680), height = 400;
  if (window.innerWidth < 600) { width = window.innerWidth - 32; height = 340; }
  
  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // 渐变定义
  const defs = svg.append('defs');
  defs.append('linearGradient')
    .attr('id', 'link-gradient')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    .html('<stop offset="0%" stop-color="#5eead4"/><stop offset="100%" stop-color="#6366f1"/>');
  defs.append('filter')
    .attr('id', 'drop-shadow')
    .html('<feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#6366f1" flood-opacity="0.5"/>');

  const color = d3.scaleOrdinal()
    .domain(['core', 'main', 'tech', 'humanity'])
    .range(['#6366f1', '#5eead4', '#a78bfa', '#f472b6']);

  // 力导向图
  const simulation = d3.forceSimulation(skillData.nodes)
    .force('link', d3.forceLink(skillData.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2));

  // 渐变线条
  const link = svg.append('g')
    .attr('stroke', 'url(#link-gradient)')
    .attr('stroke-width', 3)
    .selectAll('line')
    .data(skillData.links)
    .enter().append('line')
    .attr('opacity', 0.84);

  // 节点组
  const node = svg.append('g')
    .selectAll('g')
    .data(skillData.nodes)
    .enter().append('g')
    .attr('class', 'skill-node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // 渐变圆环
  node.append('circle')
    .attr('r', d => d.value)
    .attr('fill', '#191e2b')
    .attr('stroke', d => color(d.group))
    .attr('stroke-width', d => d.group === 'core' ? 7 : 5)
    .attr('filter', 'url(#drop-shadow)')
    .attr('opacity', 0.96)
    .on('mouseover', function (event, d) {
      d3.select(this).transition().duration(180).attr('stroke-width', d.group === 'core' ? 11 : 8).attr('opacity', 1);
      showTooltip(event, d);
    })
    .on('mouseout', function (event, d) {
      d3.select(this).transition().duration(180).attr('stroke-width', d.group === 'core' ? 7 : 5).attr('opacity', 0.96);
      hideTooltip();
    });
  
  // 节点icon
  node.append('foreignObject')
    .attr('x', d => -d.value * 0.7)
    .attr('y', d => -d.value * 0.7)
    .attr('width', d => d.value * 1.4)
    .attr('height', d => d.value * 1.4)
    .html(d => `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:${d.group==='core'?2.1:1.5}rem;"><i class='${d.icon}' style='color:${color(d.group)};'></i></div>`);

  // 节点标签
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', d => d.value + 18)
    .attr('font-size', d => d.group === 'core' ? '1.2rem' : '1rem')
    .attr('font-weight', 700)
    .attr('fill', d => color(d.group))
    .attr('filter', 'url(#drop-shadow)')
    .text(d => d.label);

  // 百分比等级
  node.filter(d=>d.percent).append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 5)
    .attr('font-size', '0.95rem')
    .attr('fill', '#8ecfff')
    .attr('font-weight', 600)
    .text(d => d.percent + '%');

  // Tooltip
  const tooltip = d3.select(selector)
    .append('div')
    .attr('class', 'skill-tooltip')
    .style('position', 'absolute')
    .style('z-index', 10)
    .style('background', 'rgba(30,34,44,0.98)')
    .style('color', '#e6eaff')
    .style('padding', '0.8em 1.1em')
    .style('border-radius', '1em')
    .style('box-shadow', '0 4px 16px #6366f1bb')
    .style('pointer-events', 'none')
    .style('font-size', '1.05em')
    .style('display', 'none');
  function showTooltip(event, d) {
    tooltip.style('display', 'block')
      .html(`<strong>${d.label}</strong><br>${d.level ? '等级：'+d.level+'<br>':''}${d.desc||''}`)
      .style('left', (event.offsetX+32)+'px')
      .style('top', (event.offsetY)+'px');
  }
  function hideTooltip() { tooltip.style('display', 'none'); }

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node
      .attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Usage: drawSkillGraph('#skill-graph')
