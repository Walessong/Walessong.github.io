// Prompt管理器
class PromptManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadPromptsData();
  }

  loadPromptsData() {
    // 简化的prompt数据
    this.promptsData = {
      writing: [
        {
          id: "blog-intro",
          name: "博客开头生成器",
          description: "生成吸引人的博客开头段落",
          template: "请为以下主题生成一个吸引人的博客开头段落：\n\n主题：{{topic}}\n目标读者：{{audience}}\n写作风格：{{style}}\n\n要求：\n- 开头要有吸引力\n- 明确表达文章价值\n- 引导读者继续阅读\n- 字数控制在100-150字",
          variables: [
            { name: "topic", label: "文章主题", type: "text" },
            { name: "audience", label: "目标读者", type: "text" },
            { name: "style", label: "写作风格", type: "select", options: ["正式", "轻松", "专业", "幽默"] }
          ]
        }
      ],
      technical: [
        {
          id: "code-review",
          name: "代码审查助手",
          description: "帮助审查和改进代码质量",
          template: "请对以下代码进行审查和改进建议：\n\n编程语言：{{language}}\n代码功能：{{function}}\n代码：\n```{{language}}\n{{code}}\n```\n\n请从以下方面进行审查：\n1. 代码逻辑和功能\n2. 代码风格和可读性\n3. 性能和优化\n4. 安全性考虑\n5. 最佳实践建议",
          variables: [
            { name: "language", label: "编程语言", type: "select", options: ["JavaScript", "Python", "Java", "C++"] },
            { name: "function", label: "代码功能描述", type: "text" },
            { name: "code", label: "代码内容", type: "textarea" }
          ]
        }
      ]
    };
    
    this.renderCategories();
  }

  setupEventListeners() {
    // 复制按钮
    document.addEventListener('click', (e) => {
      if (e.target.id === 'copy-prompt') {
        this.copyPrompt();
      }
    });
  }

  renderCategories() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return;

    categoryList.innerHTML = `
      <div class="category-item active" data-category="writing">
        <div class="flex items-center gap-3">
          <span class="text-lg">✏️</span>
          <div>
            <div class="font-medium">写作助手</div>
            <div class="text-sm text-muted-foreground">帮助创作各种类型的内容</div>
          </div>
        </div>
      </div>
      <div class="category-item" data-category="technical">
        <div class="flex items-center gap-3">
          <span class="text-lg">💻</span>
          <div>
            <div class="font-medium">技术工具</div>
            <div class="text-sm text-muted-foreground">辅助技术开发和问题解决</div>
          </div>
        </div>
      </div>
    `;

    // 绑定分类点击事件
    categoryList.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', () => {
        const category = item.dataset.category;
        this.selectCategory(category);
      });
    });

    // 默认选择第一个分类
    this.selectCategory('writing');
  }

  selectCategory(category) {
    // 更新分类选中状态
    document.querySelectorAll('.category-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    // 渲染模板列表
    this.renderTemplates(category);
  }

  renderTemplates(category) {
    const templateList = document.getElementById('template-list');
    if (!templateList) return;

    const templates = this.promptsData[category] || [];
    templateList.innerHTML = '';

    templates.forEach(template => {
      const templateCard = document.createElement('div');
      templateCard.className = 'template-card';
      templateCard.innerHTML = `
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2">${template.name}</h3>
            <p class="text-muted-foreground mb-3">${template.description}</p>
          </div>
          <button class="btn btn-primary text-sm">使用模板</button>
        </div>
      `;

      templateCard.addEventListener('click', () => {
        this.selectTemplate(template);
      });

      templateList.appendChild(templateCard);
    });
  }

  selectTemplate(template) {
    this.currentTemplate = template;
    this.showTemplateDetail();
    this.renderTemplateForm();
  }

  showTemplateDetail() {
    document.getElementById('template-list').classList.add('hidden');
    document.getElementById('template-detail').classList.remove('hidden');
  }

  renderTemplateForm() {
    if (!this.currentTemplate) return;

    const templateForm = document.getElementById('template-form');
    const templateTitle = document.getElementById('template-title');
    const templateDescription = document.getElementById('template-description');

    templateTitle.textContent = this.currentTemplate.name;
    templateDescription.textContent = this.currentTemplate.description;

    templateForm.innerHTML = '';

    this.currentTemplate.variables.forEach(variable => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = variable.label;

      let input;
      if (variable.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'form-textarea';
        input.rows = 4;
      } else if (variable.type === 'select') {
        input = document.createElement('select');
        input.className = 'form-select';
        variable.options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          input.appendChild(optionElement);
        });
      } else {
        input = document.createElement('input');
        input.className = 'form-input';
        input.type = variable.type;
      }

      input.name = variable.name;
      input.setAttribute('data-variable', variable.name);

      formGroup.appendChild(label);
      formGroup.appendChild(input);
      templateForm.appendChild(formGroup);
    });

    // 添加生成按钮
    const generateButton = document.createElement('button');
    generateButton.className = 'btn btn-primary w-full mt-6';
    generateButton.textContent = '生成Prompt';
    generateButton.addEventListener('click', () => {
      this.generatePrompt();
    });

    templateForm.appendChild(generateButton);
  }

  generatePrompt() {
    if (!this.currentTemplate) return;

    const formData = {};
    this.currentTemplate.variables.forEach(variable => {
      const input = document.querySelector(`[data-variable="${variable.name}"]`);
      if (input) {
        formData[variable.name] = input.value.trim();
      }
    });

    let generatedPrompt = this.currentTemplate.template;
    Object.keys(formData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      generatedPrompt = generatedPrompt.replace(regex, formData[key]);
    });

    document.getElementById('generated-prompt').textContent = generatedPrompt;
    document.getElementById('prompt-preview').classList.remove('hidden');
  }

  async copyPrompt() {
    const promptText = document.getElementById('generated-prompt').textContent;
    
    try {
      await navigator.clipboard.writeText(promptText);
      this.showSuccess('Prompt已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    }
  }

  showSuccess(message) {
    const toast = document.getElementById('success-toast');
    const messageEl = document.getElementById('success-message');
    
    if (toast && messageEl) {
      messageEl.textContent = message;
      toast.classList.remove('hidden');
      
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
  }
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('category-list')) {
    new PromptManager();
  }
}); 